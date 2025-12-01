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
    category: TemplateCategory
    content: string // HTML or Markdown
    variables: TemplateVariable[]
    isSystem: boolean // System templates cannot be deleted
    createdAt: string
    updatedAt: string
    createdBy: string
}

export type TemplateFormData = Omit<Template, 'templateId' | 'companyId' | 'createdAt' | 'updatedAt'> & { createdBy?: string }
