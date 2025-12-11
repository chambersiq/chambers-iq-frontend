'use client'

import { CaseForm } from '@/components/cases/CaseForm'
import { useCase, useCases } from '@/hooks/api/useCases'
import { useAuth } from '@/hooks/useAuth'

export default function EditCasePage({ params }: { params: { id: string } }) {
    const { user } = useAuth()
    const companyId = user?.companyId || ''
    // We need clientId to fetch the case. But we don't have it in URL params.
    // The backend `get_case` requires `client_id`.
    // This is a problem with the backend API design requiring `client_id` for getting a case by ID.
    // If we don't know the client_id, we can't fetch the case efficiently without the new `get_all_cases` endpoint or a new `get_case_by_id` endpoint that doesn't require client_id.
    // However, `get_all_for_company` returns all cases, so we could find it there, but that's inefficient for a single item view.
    // For now, I will assume we can get the case from the "All Cases" list if it's cached, or I need to implement `get_case_by_id` in backend that scans or uses GSI.
    // Actually, I implemented `get_all_cases` in backend.
    // I should probably implement `get_case_by_id(company_id, case_id)` in backend too (using Scan or GSI).
    // Let's check if I can do that.

    // For now, to unblock, I will use `useCases` (all) and find the case.
    const { data: cases = [], isLoading } = useCases(companyId)
    const caseData = cases.find(c => c.caseId === params.id)

    if (isLoading) {
        return <div>Loading case...</div>
    }

    if (!caseData) {
        return <div>Case not found</div>
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Edit Case</h1>
                <p className="mt-2 text-slate-600">
                    Update case details and information.
                </p>
            </div>

            <CaseForm initialData={caseData} isEditing={true} />
        </div>
    )
}
