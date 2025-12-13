export type TemplateCategory =
    | 'contract'
    | 'pleading'
    | 'letter'
    | 'motion'
    | 'discovery'
    | 'other'

export interface TemplateVariable {
    key: string
    label: string
    type: 'text' | 'date' | 'number' | 'currency'
    description?: string
}

export interface Template {
    templateId: string
    companyId: string
    name: string
    description: string
    content: string // HTML or Markdown
    category: string
    variables: TemplateVariable[]
    documentType?: string
    caseType?: string
    isSystem: boolean // System templates cannot be deleted

    // Phase 2: Categorization
    documentTypeId?: string
    courtLevelId?: string
    caseTypeId?: string
    allowedCourtLevels?: string[]
    allowedCaseTypes?: string[]
    createdAt: string
    updatedAt: string
    createdBy: string
}

export type TemplateFormData = Omit<Template, 'templateId' | 'companyId' | 'createdAt' | 'updatedAt'> & { createdBy?: string }
