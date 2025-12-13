export type DocumentType =
    | 'pleading'
    | 'motion'
    | 'order'
    | 'contract'
    | 'correspondence'
    | 'evidence'
    | 'discovery'
    | 'invoice'
    | 'other'

export type AIProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface Document {
    documentId: string
    caseId: string
    name: string
    type: DocumentType
    fileSize: number
    mimeType: string
    url: string

    // AI Analysis
    aiStatus: AIProcessingStatus
    aiSummary?: string
    aiConfidence?: number
    extractedData?: {
        parties?: string[]
        dates?: string[]
        keyFacts?: string[]
        legalIssues?: string[]
    }

    // Metadata
    uploadedBy: string
    createdAt: string
    updatedAt: string
    tags?: string[]
    description?: string

    // Required: Indian Law Categorization (Phase 2)
    documentTypeId: string
    documentCategoryId: string
    courtLevelId: string
    status: string
    parentCaseTypeId: string
}

export interface DocumentCreate {
    caseId: string
    name: string
    fileSize: number
    mimeType: string
    description?: string
    generateSummary?: boolean
    // Required: Indian Law Categorization
    documentTypeId: string
    documentCategoryId: string
    courtLevelId: string
    parentCaseTypeId: string
}
