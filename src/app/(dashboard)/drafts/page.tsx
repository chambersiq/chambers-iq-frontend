import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { DraftList } from '@/components/drafts/DraftList'

export default function DraftsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">AI Drafting</h1>
                    <p className="mt-2 text-slate-600">Manage and edit your legal documents</p>
                </div>
                <Link href="/drafts/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Draft
                    </Button>
                </Link>
            </div>

            <DraftList />
        </div>
    )
}
