'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus } from 'lucide-react'
import Link from 'next/link'
import { CaseDocumentView } from '@/components/documents/CaseDocumentView'
import { useRouter } from 'next/navigation'

// Mock lookup (in real app, fetch from API)
const getCaseName = (id: string) => {
    const cases: Record<string, string> = {
        '1': 'Smith v. Jones',
        '2': 'State v. Doe',
        '3': 'Tech Corp Merger',
        '4': 'Estate of H. Granger'
    }
    return cases[id] || `Case #${id}`
}

export default function CaseDocumentsPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const caseName = getCaseName(params.id)

    return (
        <div className="space-y-6">
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

            <CaseDocumentView caseId={params.id} caseName={caseName} />
        </div>
    )
}
