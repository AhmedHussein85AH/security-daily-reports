import React, { useState, useMemo, useEffect } from 'react'
import { IncidentData } from '../types/incident'
// Icons will be defined as inline SVGs

interface TableViewsProps {
  incidents: IncidentData[]
  onDeleteSelected?: (ids: string[]) => void
  onUpdateIncident?: (incident: IncidentData) => void
  onPrintIncident?: (incident: IncidentData) => void
}

const TableViews: React.FC<TableViewsProps> = ({ incidents, onDeleteSelected, onUpdateIncident, onPrintIncident }) => {
  const [activeTable, setActiveTable] = useState<'daily' | 'weekly' | 'monthly' | 'yearly' | 'database' | 'low'>('daily')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'low'>('all')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [editingCell, setEditingCell] = useState<{ id: string, key: keyof IncidentData } | null>(null)
  const [editValue, setEditValue] = useState<string>('')
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({})

  // Filter incidents based on CMD option and other criteria
  const filteredIncidents = useMemo(() => {
    let filtered = incidents

    // Apply CMD filtering logic
    if (activeTable === 'low') {
      // Low priority table only shows incidents with CMD & FMD & Call Centre
      filtered = incidents.filter(incident => {
        console.log('Checking incident for low table:', incident.cmdOption)
        return incident.cmdOption === 'cmd-fmd-call'
      })
      console.log('Filtered incidents for low table:', filtered.length)
    } else {
      // Other tables show all incidents regardless of CMD option
      filtered = incidents
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(incident =>
        incident.crrNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter(incident => incident.priority === filterPriority)
    }

    return filtered
  }, [incidents, activeTable, searchTerm, filterPriority])

  // Build object URLs for image attachments so we can show thumbnails
  useEffect(() => {
    const nextUrls: Record<string, string> = {}
    const created: string[] = []
    filteredIncidents.forEach((inc) => {
      if (!inc.attachments) return
      inc.attachments.forEach((file, idx) => {
        const isImage = (file as any).type?.startsWith('image/') || /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test((file as any).name || '')
        if (isImage) {
          const key = `${inc.id}-${idx}`
          const url = URL.createObjectURL(file)
          nextUrls[key] = url
          created.push(url)
        }
      })
    })
    setImageUrls(nextUrls)
    return () => {
      created.forEach((u) => URL.revokeObjectURL(u))
    }
  }, [filteredIncidents])

  const allFilteredSelected = useMemo(() => {
    if (filteredIncidents.length === 0) return false
    return filteredIncidents.every(i => selectedIds.has(i.id))
  }, [filteredIncidents, selectedIds])

  const someFilteredSelected = useMemo(() => {
    return filteredIncidents.some(i => selectedIds.has(i.id)) && !allFilteredSelected
  }, [filteredIncidents, selectedIds, allFilteredSelected])

  const toggleSelectAllFiltered = () => {
    const next = new Set(selectedIds)
    if (allFilteredSelected) {
      filteredIncidents.forEach(i => next.delete(i.id))
    } else {
      filteredIncidents.forEach(i => next.add(i.id))
    }
    setSelectedIds(next)
  }

  const toggleSelectOne = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
  }

  const clearSelection = () => setSelectedIds(new Set())

  const exportSelectedAsCSV = () => {
    const rows = incidents.filter(i => selectedIds.has(i.id))
    if (rows.length === 0) return
    const headers = [
      'id','reportNumber','crrNumber','dateTime','subject','category','location','description','responsibleDepartment','actionTaken','responseDate','lcrr','priority','cmdOption'
    ]
    const csv = [
      headers.join(','),
      ...rows.map(r => headers.map(h => {
        // @ts-expect-error index access by header
        const value = r[h]
        const text = typeof value === 'string' ? value : String(value ?? '')
        const escaped = '"' + text.replace(/"/g, '""') + '"'
        return escaped
      }).join(','))
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `incidents_export_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleBulkDelete = () => {
    if (!onDeleteSelected) return
    const ids = Array.from(selectedIds)
    if (ids.length === 0) return
    onDeleteSelected(ids)
    clearSelection()
  }

  const startEdit = (id: string, key: keyof IncidentData, initialValue: string) => {
    setEditingCell({ id, key })
    setEditValue(initialValue ?? '')
  }

  const cancelEdit = () => {
    setEditingCell(null)
    setEditValue('')
  }

  const commitEdit = (row: IncidentData) => {
    if (!editingCell || !onUpdateIncident) return cancelEdit()
    const { key } = editingCell
    const updated: IncidentData = { ...row, [key]: editValue as any }
    onUpdateIncident(updated)
    cancelEdit()
  }

  const tableHeaders = [
    { key: 'select', label: '', sortable: false },
    { key: 'reportNumber', label: '#', sortable: true },
    { key: 'crrNumber', label: 'CRR Number', sortable: true },
    { key: 'dateTime', label: 'Date & Time', sortable: true },
    { key: 'attachments', label: 'Attachments', sortable: false },
    { key: 'subject', label: 'Subject / Category', sortable: true },
    { key: 'location', label: 'Location', sortable: true },
    { key: 'description', label: 'Description', sortable: true },
    { key: 'responsibleDepartment', label: 'Responsible Department', sortable: true },
    { key: 'actionTaken', label: 'Action Taken', sortable: true },
    { key: 'responseDate', label: 'Response Date', sortable: true },
    { key: 'responseEntity', label: 'Response Entity', sortable: true }
  ]

  const tableTabs = [
    { id: 'daily', label: 'Daily', color: 'blue' },
    { id: 'weekly', label: 'Weekly', color: 'green' },
    { id: 'monthly', label: 'Monthly', color: 'purple' },
    { id: 'yearly', label: 'Yearly', color: 'orange' },
    { id: 'database', label: 'Database', color: 'indigo' },
    { id: 'low', label: 'Low Priority', color: 'red' }
  ]

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Priority badge function (ready for future use)
  // const getPriorityBadge = (priority: 'high' | 'low') => {
  //   return priority === 'high' ? (
  //     <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
  //       <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
  //       </svg>
  //       High
  //     </span>
  //   ) : (
  //     <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
  //       <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  //       </svg>
  //       Low
  //     </span>
  //   )
  // }

  return (
    <div className="space-y-6 px-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Security Reports Dashboard</h2>
          <p className="text-slate-600">Manage and view all security incidents</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search incidents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as 'all' | 'high' | 'low')}
            aria-label="Filter by priority"
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Table Tabs */}
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
        {tableTabs.map((tab) => {
          const isActive = activeTable === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTable(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                isActive
                  ? `bg-white text-${tab.color}-600 shadow-sm`
                  : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">{tab.label}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                isActive ? `bg-${tab.color}-100 text-${tab.color}-600` : 'bg-slate-200 text-slate-600'
              }`}>
                {filteredIncidents.length}
              </span>
            </button>
          )
        })}
      </div>

      {/* Table */}
      <div className="card-security">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                {tableHeaders.map((header) => (
                  <th key={header.key} className="table-header">
                    {header.key === 'select' ? (
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          aria-label="Select all"
                          checked={allFilteredSelected}
                          ref={el => {
                            if (el) el.indeterminate = someFilteredSelected
                          }}
                          onChange={toggleSelectAllFiltered}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>{header.label}</span>
                        {header.sortable && (
                          <div className="flex flex-col">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={tableHeaders.length} className="text-center py-12 text-slate-500">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-lg font-medium">No incidents found</p>
                        <p className="text-sm">
                          {searchTerm || filterPriority !== 'all' 
                            ? 'Try adjusting your search or filter criteria'
                            : 'Create your first incident report to get started'
                          }
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((incident, index) => (
                  <tr key={incident.id} className="hover:bg-slate-50 transition-colors">
                    <td className="table-cell">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          aria-label={`Select row ${index + 1}`}
                          checked={selectedIds.has(incident.id)}
                          onChange={() => toggleSelectOne(incident.id)}
                        />
                      </div>
                    </td>
                    <td className="table-cell font-medium">{incident.reportNumber}</td>
                    <td
                      className="table-cell font-mono text-sm"
                      onClick={() => startEdit(incident.id, 'crrNumber', incident.crrNumber)}
                    >
                      {editingCell?.id === incident.id && editingCell.key === 'crrNumber' ? (
                        <input
                          autoFocus
                          className="w-full border border-slate-300 rounded px-2 py-1"
                          aria-label="Edit CRR Number"
                          placeholder="CRR Number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => commitEdit(incident)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') commitEdit(incident)
                            if (e.key === 'Escape') cancelEdit()
                          }}
                        />
                      ) : (
                        <span>{incident.crrNumber || '-'}</span>
                      )}
                    </td>
                    <td className="table-cell text-sm">{formatDate(incident.dateTime)}</td>
                    <td className="table-cell">
                      {incident.attachments && incident.attachments.length > 0 ? (
                        <div className="flex flex-wrap gap-2 items-start">
                          {incident.attachments.slice(0, 3).map((file, index) => {
                            const isImage = (file as any).type?.startsWith('image/') || /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test((file as any).name || '')
                            const key = `${incident.id}-${index}`
                            if (isImage && imageUrls[key]) {
                              return (
                                <img
                                  key={index}
                                  src={imageUrls[key]}
                                  alt={(file as any).name || 'attachment image'}
                                  className="w-16 h-16 rounded border border-slate-200 object-cover cursor-pointer hover:opacity-90"
                                  onClick={() => window.open(imageUrls[key], '_blank')}
                                />
                              )
                            }
                            return (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200"
                                onClick={() => {
                                  const url = URL.createObjectURL(file)
                                  window.open(url, '_blank')
                                  setTimeout(() => URL.revokeObjectURL(url), 0)
                                }}
                                title={`Click to view: ${(file as any).name || 'attachment'}`}
                              >
                                {((file as any).name || 'file').length > 20 ? ((file as any).name || 'file').substring(0, 20) + '...' : ((file as any).name || 'file')}
                              </span>
                            )
                          })}
                          {incident.attachments.length > 3 && (
                            <span className="text-xs text-slate-500">+{incident.attachments.length - 3} more</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="table-cell">
                      <div>
                        <div
                          className="font-medium"
                          onClick={() => startEdit(incident.id, 'subject', incident.subject)}
                        >
                          {editingCell?.id === incident.id && editingCell.key === 'subject' ? (
                            <input
                              autoFocus
                              className="w-full border border-slate-300 rounded px-2 py-1"
                              aria-label="Edit Subject"
                              placeholder="Subject"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onBlur={() => commitEdit(incident)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') commitEdit(incident)
                                if (e.key === 'Escape') cancelEdit()
                              }}
                            />
                          ) : (
                            <span>{incident.subject || '-'}</span>
                          )}
                        </div>
                        <div className="text-sm text-slate-500">{incident.category || '-'}</div>
                      </div>
                    </td>
                    <td
                      className="table-cell"
                      onClick={() => startEdit(incident.id, 'location', incident.location)}
                    >
                      {editingCell?.id === incident.id && editingCell.key === 'location' ? (
                        <input
                          autoFocus
                          className="w-full border border-slate-300 rounded px-2 py-1"
                          aria-label="Edit Location"
                          placeholder="Location"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => commitEdit(incident)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') commitEdit(incident)
                            if (e.key === 'Escape') cancelEdit()
                          }}
                        />
                      ) : (
                        <span>{incident.location || '-'}</span>
                      )}
                    </td>
                    <td className="table-cell align-top" onClick={() => startEdit(incident.id, 'description', incident.description)}>
                      {editingCell?.id === incident.id && editingCell.key === 'description' ? (
                        <textarea
                          autoFocus
                          className="w-full border border-slate-300 rounded px-2 py-1"
                          aria-label="Edit Description"
                          placeholder="Description"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => commitEdit(incident)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) commitEdit(incident)
                            if (e.key === 'Escape') cancelEdit()
                          }}
                        />
                      ) : (
                        <div className="whitespace-pre-wrap break-words" title={incident.description}>
                          {incident.description || '-'}
                        </div>
                      )}
                    </td>
                    <td className="table-cell align-top" onClick={() => startEdit(incident.id, 'responsibleDepartment', incident.responsibleDepartment)}>
                      {editingCell?.id === incident.id && editingCell.key === 'responsibleDepartment' ? (
                        <input
                          autoFocus
                          className="w-full border border-slate-300 rounded px-2 py-1"
                          aria-label="Edit Responsible Department"
                          placeholder="Responsible Department"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => commitEdit(incident)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') commitEdit(incident)
                            if (e.key === 'Escape') cancelEdit()
                          }}
                        />
                      ) : (
                        <span>{incident.responsibleDepartment || '-'}</span>
                      )}
                    </td>
                    <td className="table-cell align-top" onClick={() => startEdit(incident.id, 'actionTaken', incident.actionTaken)}>
                      {editingCell?.id === incident.id && editingCell.key === 'actionTaken' ? (
                        <textarea
                          autoFocus
                          className="w-full border border-slate-300 rounded px-2 py-1"
                          aria-label="Edit Action Taken"
                          placeholder="Action Taken"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => commitEdit(incident)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) commitEdit(incident)
                            if (e.key === 'Escape') cancelEdit()
                          }}
                        />
                      ) : (
                        <div className="whitespace-pre-wrap break-words" title={incident.actionTaken}>
                          {incident.actionTaken || '-'}
                        </div>
                      )}
                    </td>
                    <td className="table-cell text-sm">{formatDate(incident.responseDate)}</td>
                    <td className="table-cell">
                      <div className="flex flex-col space-y-2">
                        <select
                          className="px-2 py-1 border border-slate-300 rounded"
                          value={incident.priority}
                          onChange={(e) => onUpdateIncident && onUpdateIncident({ ...incident, priority: e.target.value as any })}
                          aria-label="Change priority"
                        >
                          <option value="high">High</option>
                          <option value="low">Low</option>
                        </select>
                        <select
                          className="px-2 py-1 border border-slate-300 rounded"
                          value={incident.cmdOption}
                          onChange={(e) => onUpdateIncident && onUpdateIncident({ ...incident, cmdOption: e.target.value as any })}
                          aria-label="Change CMD option"
                        >
                          <option value="cmd">CMD Only</option>
                          <option value="cmd-fmd-call">CMD & FMD & Call Centre</option>
                        </select>
                        <button
                          className="px-2 py-1 rounded border border-slate-300 text-slate-700 hover:bg-white"
                          onClick={() => onPrintIncident && onPrintIncident(incident)}
                          aria-label="Print incident"
                        >
                          Print
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Bulk actions bar */}
        {selectedIds.size > 0 && (
          <div className="flex items-center justify-between px-4 py-3 bg-blue-50 border-t border-blue-200">
            <div className="text-sm text-slate-700">
              {selectedIds.size} selected
            </div>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                onClick={handleBulkDelete}
                disabled={!onDeleteSelected}
                title={onDeleteSelected ? 'Delete selected' : 'Deletion not available'}
              >
                Delete Selected
              </button>
              <button
                className="px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
                onClick={exportSelectedAsCSV}
              >
                Export CSV
              </button>
              <button
                className="px-3 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-white transition"
                onClick={clearSelection}
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Table Footer */}
        {filteredIncidents.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-200">
            <div className="text-sm text-slate-600">
              Showing {filteredIncidents.length} of {incidents.length} incidents
            </div>
            <div className="text-sm text-slate-500">
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TableViews
