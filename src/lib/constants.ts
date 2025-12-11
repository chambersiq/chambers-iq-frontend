export const DOCUMENT_TYPES = [
    { value: 'contract', label: 'Contract', category: 'contract' },
    { value: 'motion', label: 'Motion / Pleading', category: 'pleading' },
    { value: 'letter', label: 'Letter', category: 'letter' },
    { value: 'discovery', label: 'Discovery', category: 'discovery' },
    { value: 'other', label: 'Other', category: 'other' },
] as const

export type DocumentTypeValue = typeof DOCUMENT_TYPES[number]['value']
