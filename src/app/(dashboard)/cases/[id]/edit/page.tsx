import { CaseForm } from '@/components/cases/CaseForm'
import { Case } from '@/types/case'

// Mock data fetcher
const getCase = (id: string): Case | undefined => {
    // In a real app, fetch from API
    if (id === '1') {
        return {
            id: '1',
            caseNumber: 'CV-2024-001',
            caseName: 'Smith v. Jones',
            clientId: '1',
            clientName: 'John Smith',
            caseType: 'civil-litigation',
            status: 'active',
            priority: 'high',
            caseSummary: 'Breach of contract dispute regarding construction delays.',
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-20T14:30:00Z',
            createdBy: 'user1',
            archived: false,
            feeArrangement: 'hourly'
        }
    }
    return undefined
}

export default function EditCasePage({ params }: { params: { id: string } }) {
    const caseData = getCase(params.id)

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
