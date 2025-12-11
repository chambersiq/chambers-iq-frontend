'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus } from 'lucide-react'
import Link from 'next/link'
import { CaseDocumentView } from '@/components/documents/CaseDocumentView'
import { useRouter } from 'next/navigation'

// Mock lookup (in real app, fetch from API)
import { useCase } from '@/hooks/api/useCases'
import { useAuth } from '@/hooks/useAuth'

export default function CaseDocumentsPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const { user } = useAuth()
    const companyId = user?.companyId || ''
    const { data: caseData } = useCase(companyId, params.id)

    // Fallback to ID if loading or not found, but CaseDocumentView might handle it
    const caseName = caseData?.caseName || `Case #${params.id}`

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/documents">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">{caseName}</h1>
                        <p className="mt-2 text-slate-600">Document Repository</p>
                    </div>
                </div>
                <Link href={`/cases/${params.id}/documents/new`}>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Documents
                    </Button>
                </Link>
            </div>

            <CaseDocumentView caseId={params.id} caseName={caseName} hideHeader={true} />
        </div>
    )
}
