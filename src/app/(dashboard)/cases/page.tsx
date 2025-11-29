import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { CaseList } from '@/components/cases/CaseList'

export default function CasesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Cases</h1>
                    <p className="mt-2 text-slate-600">Manage legal cases and matters</p>
                </div>
                <Link href="/cases/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Case
                    </Button>
                </Link>
            </div>

            <CaseList />
        </div>
    )
}
