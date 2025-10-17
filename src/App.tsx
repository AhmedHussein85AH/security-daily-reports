import { useState } from 'react'
import IncidentReportForm from './components/IncidentReportForm'
import TableViews from './components/TableViews'
import AnalyticsDashboard from './components/AnalyticsDashboard'
import ReportPrintView from './components/ReportPrintView'
import { IncidentData } from './types/incident'

function App() {
  const [incidents, setIncidents] = useState<IncidentData[]>([])
  const [activeView, setActiveView] = useState<'form' | 'tables' | 'analytics' | 'print'>('form')
  const [printIncident, setPrintIncident] = useState<IncidentData | null>(null)

  const handleIncidentSubmit = (incident: IncidentData) => {
    console.log('Submitted incident:', incident)
    console.log('CMD Option:', incident.cmdOption)
    console.log('Priority:', incident.priority)
    setIncidents(prev => [...prev, incident])
    setActiveView('tables')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Security Daily Reports</h1>
                <p className="text-white/80 text-sm">Security Incident Management System</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveView('form')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeView === 'form' 
                    ? 'bg-white/20 text-white' 
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                New Report
              </button>
              <button
                onClick={() => setActiveView('tables')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeView === 'tables' 
                    ? 'bg-white/20 text-white' 
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                View Reports
              </button>
              <button
                onClick={() => setActiveView('analytics')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeView === 'analytics' 
                    ? 'bg-white/20 text-white' 
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                Analytics
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-none mx-auto px-2 sm:px-4 py-8">
        {activeView === 'form' && (
          <IncidentReportForm onSubmit={handleIncidentSubmit} />
        )}
        {activeView === 'tables' && (
          <TableViews
            incidents={incidents}
            onDeleteSelected={(ids) => {
              setIncidents(prev => prev.filter(i => !ids.includes(i.id)))
            }}
            onUpdateIncident={(updated) => {
              setIncidents(prev => prev.map(i => i.id === updated.id ? updated : i))
            }}
            onPrintIncident={(incident) => { setPrintIncident(incident); setActiveView('print') }}
          />
        )}
        {activeView === 'analytics' && (
          <AnalyticsDashboard incidents={incidents} />
        )}
        {activeView === 'print' && printIncident && (
          <ReportPrintView incident={printIncident} onBack={() => setActiveView('tables')} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-6 mt-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-slate-300">
            © 2026 Security Security Department. Developed by Ahmed Hussein, Security Coordinator.
          </p>
          <p className="mt-2 text-lg text-slate-200 font-semibold tracking-wide">Made with ❤️</p>
        </div>
      </footer>
    </div>
  )
}

export default App
