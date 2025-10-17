import React, { useState, useRef, useEffect } from 'react'
import { IncidentData, ResponsibilityEntry } from '../types/incident'
// Icons will be defined as inline SVGs

interface IncidentReportFormProps {
  onSubmit: (incident: IncidentData) => void
}

const IncidentReportForm: React.FC<IncidentReportFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    reportNumber: 1,
    crrNumber: '',
    dateTime: '',
    subject: '',
    category: '',
    location: '',
    description: '',
    responsibleDepartment: '',
    actionTaken: '',
    responseDate: '',
    lcrr: '',
    priority: 'low' as 'high' | 'low',
    cmdOption: 'cmd' as 'cmd' | 'cmd-fmd-call'
  })

  const [responsibility, setResponsibility] = useState<ResponsibilityEntry[]>([
    { id: '1', description: '', type: 'violation' }
  ])

  const departments = [
    'CMD', 'FMD', 'OPS', 'IT', 'Construction', 'Safety', 'Markting', 'Development',
    'Hospitality', 'Security', 'WareHouse', 'Call Centre', 'Landscape', 'Retail & Leasing'
  ]
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([])

  const [attachments, setAttachments] = useState<File[]>([])
  const [subjectSearch, setSubjectSearch] = useState('')
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const subjectCategories = [
    "Installation of satellite",
    "Asset Damages/Misuse of Public areas (public toilets- swimming pool - Using the elevator to move furniture or construction equipment - sports area- Lounges)",
    "Misuse of Public Areas-Building door security lapse",
    "Unpermitted Photoshoots, Advertising, Shows in Public areas",
    "Dumping garbage or landscape waste out of designated areas",
    "Dumping construction waste in garbage rooms or around the unit",
    "Underage driving (Driving for persons under the legal age) - Cars",
    "Noise and disturbance from Cars (loud music, car engines)",
    "Racing/Unlicensed Cars/ Advertising Cars for Sale or Rent with Stickers in Public Places",
    "Roads/Gate Blocking (by Cars-Golf Carts-Contractor's cars)",
    "Charge golf carts in non- designated areas / Disconnecting the charger from the neighbor's golf cart without authorization",
    "Hit and run car accident",
    "Occupying multiple parking slots using one vehicle",
    "Parking cars in specified charging slots (Golf carts / Electric vehicles)",
    "Unpermitted events inside the unit without the CM notification /Noise &loud music",
    "Pet Dog /Pet Dog License / dogs in retails and kids' areas/ underage dogs walkers / unregistered walkers' trainers",
    "Selling QR codes",
    "Identity Manipulation",
    "Unauthorized access",
    "Renting Unit without CM notification",
    "Verbal or Physical Assault Against Individuals or Residential Community Staff and Officials",
    "Unauthorized internal alterations/modifications",
    "Fight Picking / Fire Initiation /Fireworks",
    "Landscape Violation (Types -Lengths -Irrigation systems)",
    "Entering workers without a work permit from the CM / Working at unauthorized times and days/ Unpermitted material entry",
    "Drinking Alcohol in Public Areas",
    "Unpermitted Fishing",
    "Beach/ Pool / lagoons rules / swimming wear rules Violation",
    "Gate barrier",
    "Misuse or damages of Sports facilities",
    "Swimming pool furniture",
    "Clubhouse furniture",
    "Building lobbies furniture",
    "Community center/clubhouse unauthorized gatherings,Excessive water car wash",
    "Driving beach buggies,UTV cars are restricted regardless driver's license",
    "Events loud noises-Access Beaches with unpermitted loudspeakers",
    "Pets Violations-Unmuzzled Dog & Unleashed Dog",
    "Pets Violations-Pets Noise",
    "Pets Violations-Unmuzzled Pet Dog",
    "Pets Violations-Underage Dogs Walkers",
    "Pets Violations-Stray Animals",
    "Pets Violations-Unleashed Pet Dog",
    "Pets Violations-Prohibited Dog Breed",
    "Misuse of Public Areas-Car wash",
    "Misuse of Public Areas-Wasting water",
    "Misuse of Public Areas-Landscape waste",
    "Breached your Company Name Community Rules",
    "Misuse of Public Areas-Elevator misuse",
    "Misuse of Public Areas-Abandoned items in public areas",
    "Driving in the wrong direction / Unsafe driving",
    "Underage driving (Driving for persons under the legal age) -(Golf Carts-Glide-Motor cycles)",
    "Obstructing traffic and roads blockage with the use of any moving vehicle or in person",
    "Jet Ski Violations"
  ]

  const filteredSubjects = subjectCategories.filter(category =>
    category.toLowerCase().includes(subjectSearch.toLowerCase())
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubjectSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubjectSearch(e.target.value)
    setShowSubjectDropdown(true)
  }

  const handleSubjectSelect = (category: string) => {
    setFormData(prev => ({ ...prev, subject: category }))
    setSubjectSearch('')
    setShowSubjectDropdown(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSubjectDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleDepartment = (name: string) => {
    setSelectedDepartments(prev => {
      const has = prev.includes(name)
      const next = has ? prev.filter(d => d !== name) : [...prev, name]
      return next
    })
  }

  // Keep actionTaken and responsibleDepartment in sync with selected departments
  useEffect(() => {
    const list = selectedDepartments.join(', ')
    setFormData(prev => ({
      ...prev,
      responsibleDepartment: list,
      actionTaken: list ? `The Report has been sent to ${list} to be informed.` : ''
    }))
  }, [selectedDepartments])

  const handleResponsibilityChange = (id: string, field: keyof ResponsibilityEntry, value: string) => {
    setResponsibility(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, [field]: value }
          : item
      )
    )
  }

  const addResponsibilityEntry = () => {
    const newId = (responsibility.length + 1).toString()
    setResponsibility(prev => [...prev, { id: newId, description: '', type: 'violation' }])
  }

  const removeResponsibilityEntry = (id: string) => {
    setResponsibility(prev => prev.filter(item => item.id !== id))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(prev => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const handleSubmit = (priority: 'low' | 'high') => {
    const incident: IncidentData = {
      id: Date.now().toString(),
      ...formData,
      responsibleDepartment: selectedDepartments.join(', '),
      responsibility,
      attachments,
      createdAt: new Date(),
      priority: priority
    }

    onSubmit(incident)
    
    // Reset form
    setFormData({
      reportNumber: formData.reportNumber + 1,
      crrNumber: '',
      dateTime: '',
      subject: '',
      category: '',
      location: '',
      description: '',
      responsibleDepartment: '',
      actionTaken: '',
      responseDate: '',
      lcrr: '',
      priority: 'low',
      cmdOption: 'cmd'
    })
    setResponsibility([{ id: '1', description: '', type: 'violation' }])
    setAttachments([])
    setSelectedDepartments([])
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="card-security animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Security Incident Report</h2>
              <p className="text-slate-600">Daily Security Incidents Reports</p>
            </div>
          </div>
          
          {/* Priority Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, priority: 'low' }))}
              className={`btn-priority-low ${formData.priority === 'low' ? 'ring-2 ring-green-500' : ''}`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Save as Low Priority
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, priority: 'high' }))}
              className={`btn-priority-high ${formData.priority === 'high' ? 'ring-2 ring-red-500' : ''}`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Save as High Priority
            </button>
          </div>
        </div>

        <form className="space-y-8">
          {/* Attachments Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Attachments
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 transition-colors">
                <svg className="w-12 h-12 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
                <p className="text-slate-600 mb-2">Upload images or documents</p>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="attachments"
                />
                <label
                  htmlFor="attachments"
                  className="btn-secondary cursor-pointer inline-block"
                >
                  Choose Files
                </label>
                {attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {attachments.map((file, index) => (
                      <div key={index} className="text-sm text-slate-600 bg-slate-100 rounded px-2 py-1">
                        {file.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sample Image Placeholder */}
            <div className="lg:col-span-2">
              <div className="bg-slate-200 rounded-lg h-48 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 text-slate-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm2 2h8v8H8V8z"/>
                  </svg>
                  <p className="text-slate-500">Incident Image</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Report Details */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
                Report Details
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Report Number
                  </label>
                  <input
                    type="number"
                    name="reportNumber"
                    value={formData.reportNumber}
                    onChange={handleInputChange}
                    className="input-security"
                    aria-label="Report Number"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    CRR Number
                  </label>
                  <input
                    type="text"
                    name="crrNumber"
                    value={formData.crrNumber}
                    onChange={handleInputChange}
                    className="input-security"
                    placeholder="Enter CRR Number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="dateTime"
                  value={formData.dateTime}
                  onChange={handleInputChange}
                  className="input-security"
                  aria-label="Date and Time"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Subject / Category
                </label>
                <div className="relative" ref={dropdownRef}>
                  <div className="flex space-x-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={subjectSearch || formData.subject}
                        onChange={handleSubjectSearch}
                        onFocus={() => setShowSubjectDropdown(true)}
                        className="input-security w-full"
                        placeholder="Type to search categories..."
                      />
                      {showSubjectDropdown && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {filteredSubjects.length > 0 ? (
                            filteredSubjects.map((category, index) => (
                              <div
                                key={index}
                                onClick={() => handleSubjectSelect(category)}
                                className="px-4 py-2 hover:bg-slate-100 cursor-pointer text-sm border-b border-slate-100 last:border-b-0"
                              >
                                <div className="font-medium text-slate-800">
                                  {category.split('(')[0].trim()}
                                </div>
                                {category.includes('(') && (
                                  <div className="text-xs text-slate-500 mt-1">
                                    {category.split('(')[1].replace(')', '')}
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-slate-500 text-sm">
                              No categories found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Shortcut
                    </button>
                  </div>
                  {formData.subject && (
                    <div className="mt-2 p-2 bg-slate-50 rounded-lg">
                      <div className="text-sm font-medium text-slate-700">Selected:</div>
                      <div className="text-sm text-slate-600">{formData.subject}</div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="input-security"
                  placeholder="Enter incident location"
                />
              </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Responsible Departments (select multiple)
              </label>
              <div className="flex flex-wrap gap-2">
                {departments.map((dept) => {
                  const active = selectedDepartments.includes(dept)
                  return (
                    <label key={dept} className={`cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-lg border-2 text-sm transition ${active ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-slate-300 text-slate-700 hover:border-purple-400'}`}>
                      <input
                        type="checkbox"
                        aria-label={`Select ${dept}`}
                        className="w-4 h-4"
                        checked={active}
                        onChange={() => toggleDepartment(dept)}
                      />
                      <span>{dept}</span>
                    </label>
                  )
                })}
              </div>
              {selectedDepartments.length > 0 && (
                <div className="mt-2 text-sm text-slate-600">
                  Selected: {selectedDepartments.join(', ')}
                </div>
              )}
            </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="input-security"
                  placeholder="Enter detailed description of the incident"
                />
              </div>
            </div>

            {/* Right Column - Responsibility */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
                Responsibility
              </h3>

              <div className="space-y-4">
                {responsibility.map((entry) => (
                  <div key={entry.id} className="p-4 bg-slate-50 rounded-lg space-y-3">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Unit/Department Involved
                        </label>
                        <input
                          type="text"
                          value={entry.description}
                          onChange={(e) => handleResponsibilityChange(entry.id, 'description', e.target.value)}
                          className="input-security"
                          placeholder="Enter unit or department name"
                        />
                      </div>
                      {responsibility.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeResponsibilityEntry(entry.id)}
                          className="text-red-500 hover:text-red-700 p-2 mt-6"
                          aria-label="Remove responsibility entry"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <div className="flex items-center space-x-6">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`type-${entry.id}`}
                          checked={entry.type === 'violation'}
                          onChange={() => handleResponsibilityChange(entry.id, 'type', 'violation')}
                          className="w-4 h-4 text-red-600"
                        />
                        <span className="text-sm font-medium text-red-700">Violation</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`type-${entry.id}`}
                          checked={entry.type === 'incident'}
                          onChange={() => handleResponsibilityChange(entry.id, 'type', 'incident')}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm font-medium text-blue-700">Incident</span>
                      </label>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addResponsibilityEntry}
                  className="w-full flex items-center justify-center space-x-2 py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-slate-400 hover:text-slate-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Add Responsibility Entry</span>
                </button>
              </div>


              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Action Taken
                </label>
                <textarea
                  name="actionTaken"
                  value={formData.actionTaken}
                  onChange={handleInputChange}
                  rows={3}
                  className="input-security"
                  placeholder="Action taken will be auto-generated based on CMD selection"
                  aria-label="Action taken"
                  readOnly
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Response Date
                  </label>
                  <input
                    type="date"
                    name="responseDate"
                    value={formData.responseDate}
                    onChange={handleInputChange}
                    className="input-security"
                  aria-label="Response Date"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    LCRR
                  </label>
                  <input
                    type="text"
                    name="lcrr"
                    value={formData.lcrr}
                    onChange={handleInputChange}
                    className="input-security"
                    placeholder="Enter LCRR"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Priority Save Buttons */}
          <div className="flex justify-center gap-6 pt-8 border-t border-slate-200">
            <button
              type="button"
              onClick={() => handleSubmit('low')}
              className="btn-priority-low px-8 py-4 text-lg flex flex-col items-center space-y-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              <span className="font-bold">Save as Low Priority</span>
            </button>
            
            <button
              type="button"
              onClick={() => handleSubmit('high')}
              className="btn-priority-high px-8 py-4 text-lg flex flex-col items-center space-y-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="font-bold">Save as High Priority</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default IncidentReportForm
