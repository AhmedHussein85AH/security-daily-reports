export interface IncidentData {
  id: string
  reportNumber: number
  crrNumber: string
  dateTime: string
  subject: string
  category: string
  location: string
  description: string
  responsibleDepartment: string
  actionTaken: string
  responseDate: string
  lcrr: string
  priority: 'high' | 'low'
  cmdOption: 'cmd' | 'cmd-fmd-call'
  responsibility: ResponsibilityEntry[]
  attachments?: File[]
  createdAt: Date
}

export interface ResponsibilityEntry {
  id: string
  description: string
  type: 'violation' | 'incident'
}

export interface TableData {
  daily: IncidentData[]
  weekly: IncidentData[]
  monthly: IncidentData[]
  yearly: IncidentData[]
  database: IncidentData[]
  low: IncidentData[]
}
