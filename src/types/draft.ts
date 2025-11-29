export type DraftStatus = 'draft' | 'review' | 'final'

export interface Draft {
    id: string
    name: string
    caseId: string
    caseName: string
    clientId: string
    clientName: string
    status: DraftStatus
    content: string
    lastEditedAt: string
    createdAt: string
}

export interface ChatMessage {
    id: string
    role: 'user' | 'assistant' | 'system'
    content: string
    timestamp: string
}
