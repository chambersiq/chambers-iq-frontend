export interface CourtLevel {
    id: string;
    name: string;
    short_code: string;
    hierarchy_level: number;
}

export interface CaseType {
    id: string;
    name: string;
    practice_area: string;
    primary_statute: string;
    typical_limitation_years: number | null;
    allowed_doc_types: string[];
    common_reliefs: string[];
}

export interface DocumentCategory {
    id: string;
    name: string;
}

export interface DocumentType {
    id: string;
    name: string;
    category_id: string;
}

export interface SupportingDocumentSubcategory {
    id: string;
    name: string;
    accepts: string[];
}

export interface SupportingDocumentCategory {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    subcategories: SupportingDocumentSubcategory[];
}

export interface PartyType {
    id: string;
    name: string;
    requires_pan: boolean;
    requires_cin?: boolean;
    requires_llpin?: boolean;
}

export interface Statute {
    id: string;
    name: string;
    short_name: string;
    type: string;
}

export interface ReliefType {
    id: string;
    name: string;
    practice_area: string;
}

export interface MasterData {
    court_levels: CourtLevel[];
    case_types: CaseType[];
    document_categories: DocumentCategory[];
    document_types: DocumentType[];
    supporting_document_categories: SupportingDocumentCategory[];
    party_types: PartyType[];
    statutes: Statute[];
    relief_types: ReliefType[];
}
