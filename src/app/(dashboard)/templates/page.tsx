import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { TemplateList } from '@/components/templates/TemplateList'

export default function TemplatesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Templates</h1>
                    <p className="mt-2 text-slate-600">Create and manage legal document templates</p>
                </div>
                <Link href="/templates/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Template
                    </Button>
                </Link>
            </div>

            <TemplateList />
        </div>
    )
}
