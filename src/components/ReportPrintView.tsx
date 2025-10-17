import React, { useMemo } from 'react'
import { IncidentData } from '../types/incident'

interface ReportPrintViewProps {
  incident: IncidentData
  onBack?: () => void
}

const Field: React.FC<{ label: string; value?: React.ReactNode }> = ({ label, value }) => (
  <div className="grid grid-cols-3 border border-slate-400 text-xs">
    <div className="col-span-1 bg-slate-100 px-2 py-1 font-semibold text-slate-700">{label}</div>
    <div className="col-span-2 px-2 py-1 text-slate-800">{value || '-'}</div>
  </div>
)

const ReportPrintView: React.FC<ReportPrintViewProps> = ({ incident, onBack }) => {
  const departments = useMemo(() => (incident.responsibleDepartment || '').split(',').map(s => s.trim()).filter(Boolean), [incident])

  return (
    <div className="print-bg">
      <div className="no-print flex justify-between items-center mb-4">
        <button className="px-3 py-2 rounded border border-slate-300 text-slate-700" onClick={onBack}>Back</button>
        <button className="px-3 py-2 rounded bg-blue-600 text-white" onClick={() => window.print()}>Print</button>
      </div>

      {/* Page 1 */}
      <section className="sheet">
        <header className="flex items-center justify-between mb-2">
          <div className="text-2xl font-bold text-slate-800">your Company Name</div>
          <div className="text-lg font-semibold text-slate-700">Security Security</div>
          <div className="text-lg font-bold text-slate-800">Security</div>
        </header>
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 text-center rounded-sm mb-2 font-semibold">
          Incident Summary (INSUM)
        </div>
        <div className="grid grid-cols-2 gap-0 border border-slate-400">
          <Field label="Ref No." value={incident.reportNumber} />
          <Field label="Time" value={new Date(incident.dateTime || incident.createdAt).toLocaleTimeString()} />
          <Field label="Date" value={new Date(incident.dateTime || incident.createdAt).toLocaleDateString()} />
          <Field label="Incident Specific Location" value={incident.location} />
          <Field label="Incident Category" value={incident.category} />
          <Field label="Subject" value={incident.subject} />
        </div>
        <div className="mt-1 border border-slate-400">
          <div className="bg-slate-100 text-slate-700 text-xs font-semibold px-2 py-1 border-b border-slate-400 text-center">Incident Details</div>
          <div className="px-2 py-1 text-xs whitespace-pre-wrap min-h-[400px]">{incident.description || '-'}</div>
        </div>
        <div className="mt-1 border border-slate-400">
          <div className="bg-slate-100 text-slate-700 text-xs font-semibold px-2 py-1 border-b border-slate-400 text-center">Action Taken</div>
          <div className="px-2 py-1 text-xs whitespace-pre-wrap min-h-[250px]">{incident.actionTaken || '-'}</div>
        </div>
        <div className="mt-2 border border-slate-400">
          <div className="grid grid-cols-2 gap-0 text-xs">
            <Field label="Response Date" value={incident.responseDate ? new Date(incident.responseDate).toLocaleDateString() : '-'} />
            <Field label="Priority" value={incident.priority.toUpperCase()} />
            <Field label="Departments" value={departments.join(' • ') || '-'} />
            <Field label="CRR Number" value={incident.crrNumber || '-'} />
          </div>
        </div>
        
        {/* Signature Tables */}
        <div className="mt-2 grid grid-cols-3 gap-0 border border-slate-400">
          <div className="border-r border-slate-400">
            <div className="bg-slate-100 text-slate-700 text-xs font-semibold px-2 py-1 border-b border-slate-400">Security Supervisor your Company Name</div>
            <div className="px-2 py-1 text-xs space-y-1">
              <div><strong>Name:</strong> <input type="text" className="border-none bg-transparent text-xs w-20" placeholder="Enter name" /></div>
              <div><strong>Designation:</strong> <input type="text" className="border-none bg-transparent text-xs w-16" placeholder="Supervisor" /></div>
              <div><strong>ID. No.:</strong> <input type="text" className="border-none bg-transparent text-xs w-20" placeholder="Enter ID" /></div>
              <div><strong>Signature & Date:</strong> <input type="text" className="border-none bg-transparent text-xs w-20" placeholder="Sign & date" /></div>
            </div>
          </div>
          <div className="border-r border-slate-400">
            <div className="bg-slate-100 text-slate-700 text-xs font-semibold px-2 py-1 border-b border-slate-400">Admin FORCES Security</div>
            <div className="px-2 py-1 text-xs space-y-1">
              <div><strong>Name:</strong> <input type="text" className="border-none bg-transparent text-xs w-20" placeholder="Enter name" /></div>
              <div><strong>Designation:</strong> <input type="text" className="border-none bg-transparent text-xs w-16" placeholder="Admin Coordinator" /></div>
              <div><strong>ID. No.:</strong> <input type="text" className="border-none bg-transparent text-xs w-20" placeholder="Enter ID" /></div>
              <div><strong>Signature & Date:</strong> <input type="text" className="border-none bg-transparent text-xs w-20" placeholder="Sign & date" /></div>
            </div>
          </div>
          <div>
            <div className="bg-slate-100 text-slate-700 text-xs font-semibold px-2 py-1 border-b border-slate-400">Report Submitted to your Company Name Security Group-MISR</div>
            <div className="px-2 py-1 text-xs space-y-1">
              <div><strong>Received By:</strong> <input type="text" className="border-none bg-transparent text-xs w-20" placeholder="Enter name" /></div>
              <div><strong>Designation:</strong> <input type="text" className="border-none bg-transparent text-xs w-16" placeholder="Security Coordinator" /></div>
              <div><strong>your Company Name Entity:</strong> <input type="text" className="border-none bg-transparent text-xs w-16" placeholder="Security" /></div>
              <div><strong>Signature & Date:</strong> <input type="text" className="border-none bg-transparent text-xs w-20" placeholder="Sign & date" /></div>
            </div>
          </div>
        </div>
        
        <footer className="mt-3 text-center">
          <div className="text-sm font-bold text-slate-800">CONFIDENTIAL</div>
          <div className="text-[10px] text-slate-600 mt-1">
            NOTE: Be diligent. As applicable, if you view or download a copy of any document [policy/process/form] and you print it out, you should write your name on the front cover [for document control purposes]. If you receive a hard copy of any document [policy/process/form], please, write your name on the front cover [for document control purposes].
          </div>
        </footer>
      </section>

      {/* Page 2 - Attachments */}
      <section className="sheet page-break">
        <header className="flex items-center justify-between mb-2">
          <div className="text-2xl font-bold text-slate-800">your Company Name</div>
          <div className="text-lg font-semibold text-slate-700">Security Security</div>
          <div className="text-lg font-bold text-slate-800">Security</div>
        </header>
        <div className="bg-slate-200 text-slate-800 py-2 text-center rounded-sm mb-2 font-semibold border border-slate-400">
          Attachments
        </div>
        <div className="min-h-[500px] border border-slate-400 rounded-sm p-1 grid grid-cols-4 gap-1">
          {(incident.attachments || []).map((file, idx) => (
            <div key={idx} className="border border-slate-300 rounded-sm p-1 text-center text-[10px]">
              {(file as any).type?.startsWith('image/') ? (
                <img className="w-full h-32 object-cover" src={URL.createObjectURL(file)} alt={(file as any).name || 'attachment'} onLoad={(e)=> URL.revokeObjectURL((e.target as HTMLImageElement).src)} />
              ) : (
                <span>{(file as any).name || 'File'}</span>
              )}
            </div>
          ))}
        </div>
        <footer className="mt-3 text-center">
          <div className="text-sm font-bold text-slate-800">CONFIDENTIAL</div>
          <div className="text-[10px] text-slate-600 mt-1">Page 2</div>
        </footer>
      </section>
    </div>
  )
}

export default ReportPrintView


