// Client Types
export type ClientType = 'individual' | 'company'

export type ClientStatus = 'active' | 'inactive'

export interface IndividualClient {
    clientId: string
    clientType: 'individual'

    // Personal Information
    fullName: string
    email: string
    phone: string
    alternatePhone?: string
    dateOfBirth?: string
    gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say'
    ssn?: string // Last 4 digits only

    // Address
    streetAddress?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string

    // Employment
    employerName?: string
    jobTitle?: string
    industry?: string

    // Additional
    preferredContactMethod?: 'email' | 'phone' | 'text'
    preferredLanguage?: string
    notes?: string
    status: ClientStatus
    tags?: string[]
    referralSource?: string

    // Metadata
    createdAt: string
    updatedAt: string
    totalCases: number
}

export interface CompanyClient {
    clientId: string
    clientType: 'company'

    // Company Information
    companyName: string
    dbaName?: string
    companyType?: 'llc' | 'corporation' | 'partnership' | 'sole-proprietor' | 'other'
    taxId?: string // EIN
    industry?: string
    companySize?: 'small' | 'medium' | 'large'
    website?: string

    // Primary Contact
    contactName: string
    contactTitle?: string
    contactEmail: string
    contactPhone: string
    contactAlternatePhone?: string

    // Company Address
    streetAddress?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string

    // Registered Agent
    registeredAgentName?: string
    registeredAgentAddress?: string
    stateOfIncorporation?: string

    // Secondary Contacts
    secondaryContacts?: Array<{
        name: string
        title?: string
        email?: string
        phone?: string
        relationship?: string
    }>

    // Additional
    preferredContactMethod?: 'email' | 'phone'
    billingContact?: string
    billingEmail?: string
    notes?: string
    status: ClientStatus
    tags?: string[]
    referralSource?: string
    parentCompany?: string

    // Metadata
    createdAt: string
    updatedAt: string
    totalCases: number
}

export type Client = IndividualClient | CompanyClient

// Form data types (for creating/editing)
export type ClientFormData = Omit<IndividualClient | CompanyClient, 'id' | 'createdAt' | 'updatedAt' | 'totalCases'>
