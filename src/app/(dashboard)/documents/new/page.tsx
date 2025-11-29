'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { BulkDocumentUploader } from '@/components/documents/BulkDocumentUploader'

export default function NewDocumentPage() {
    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/documents">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Upload Documents</h1>
                    <p className="mt-2 text-slate-600">
                        Add documents to your global library
                    </p>
                </div>
            </div>

            <BulkDocumentUploader
                cancelHref="/documents"
            />
        </div>
    )
}
