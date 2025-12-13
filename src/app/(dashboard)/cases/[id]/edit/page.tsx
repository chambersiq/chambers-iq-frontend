'use client'

import { CaseForm } from '@/components/cases/CaseForm'
import { useCase, useCases } from '@/hooks/api/useCases'
import { useAuth } from '@/hooks/useAuth'

export default function EditCasePage({ params }: { params: { id: string } }) {
    const { user } = useAuth()
    const companyId = user?.companyId || ''
    // Use the single case hook to ensure we get full details (including large text fields)
    const { data: caseData, isLoading } = useCase(companyId, params.id)

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
