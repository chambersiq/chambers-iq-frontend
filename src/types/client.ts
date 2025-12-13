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
    pan?: string // PAN Number

    // Address
    streetAddress?: string
    city?: string
    state?: string
    pincode?: string
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

    partyTypeId?: string

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
    companyType?: 'pvt-ltd' | 'public-ltd' | 'llp' | 'partnership' | 'sole-proprietor' | 'other'
    taxId?: string // GSTIN
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
    pincode?: string
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

    partyTypeId?: string

    // Metadata
    createdAt: string
    updatedAt: string
    totalCases: number
}

export type Client = IndividualClient | CompanyClient

// Form data types (for creating/editing)
export type ClientFormData = Omit<IndividualClient | CompanyClient, 'id' | 'createdAt' | 'updatedAt' | 'totalCases'>
