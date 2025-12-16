// Case Types
export type CaseStatus = 'draft' | 'active' | 'discovery' | 'motion-practice' | 'trial' | 'settlement' | 'closed' | 'on-hold'

export type CaseType =
    | 'civil-litigation'
    | 'criminal-defense'
    | 'family-law'
    | 'corporate-law'
    | 'real-estate'
    | 'intellectual-property'
    | 'employment'
    | 'immigration'
    | 'bankruptcy'
    | 'estate-planning'
    | 'tax-law'
    | 'other'

export type CasePriority = 'low' | 'medium' | 'high' | 'urgent'

export type FeeArrangement = 'hourly' | 'contingency' | 'flat-fee' | 'hybrid'

export interface Party {
    name: string
    type: string
    address?: string
    opposingCounselName?: string
    opposingCounselFirm?: string
    opposingCounselEmail?: string
    opposingCounselPhone?: string
}

export interface ImportantDate {
    id: string
    name: string
    date: string
    description?: string
    reminderDays?: number // Days before to remind
}

export interface Case {
    caseId: string

    // Basic Info
    caseNumber: string // Auto-generated or user-provided
    caseName: string
    clientId: string
    clientName: string // Denormalized for display

    caseSubType?: string
    status: CaseStatus

    // Case Summary (P0 requirement)
    caseSummary: string // Minimum 100 chars
    clientPosition?: string
    opposingPartyPosition?: string

    keyFacts?: string[]
    legalIssues?: string
    prayer?: string
    caseStrategyNotes?: string

    // Case Details
    jurisdiction?: 'federal' | 'state'
    // Phase 2: Indian Law Categorization
    courtLevelId?: string
    caseTypeId?: string
    practiceArea?: string
    primaryStatuteId?: string
    limitationYears?: number
    allowedDocTypeIds?: string[]
    reliefIds?: string[]

    venue?: string
    courtName?: string
    department?: string
    judgeName?: string
    caseFiledDate?: string
    docketNumber?: string

    // Parties
    opposingPartyName?: string
    opposingPartyType?: 'individual' | 'company'
    opposingCounselName?: string
    opposingCounselFirm?: string
    opposingCounselEmail?: string
    opposingCounselPhone?: string
    additionalParties?: Party[]

    // Important Dates
    statuteOfLimitationsDate?: string
    nextHearingDate?: string
    trialDate?: string
    discoveryCutoff?: string
    motionFilingDeadlines?: ImportantDate[]
    mediationDate?: string
    settlementConferenceDate?: string
    customDeadlines?: ImportantDate[]

    // Financial
    estimatedCaseValue?: number
    clientDamagesClaimed?: number
    feeArrangement: FeeArrangement
    contingencyFeePercent?: number
    hourlyBillingRate?: number
    flatFeeAmount?: number
    retainerAmount?: number
    budgetEstimate?: number
    costsAdvanced?: number

    // Additional
    priority: CasePriority
    caseSource?: string
    conflictCheckStatus?: 'pending' | 'cleared' | 'conflict-identified'
    tags?: string[]
    caseNotes?: string
    relatedCaseIds?: string[]
    archived: boolean

    // Metadata
    createdAt: string
    updatedAt: string
    createdBy: string
}

export type CaseFormData = Omit<Case, 'caseId' | 'createdAt' | 'updatedAt' | 'createdBy' | 'clientName' | 'archived'>
