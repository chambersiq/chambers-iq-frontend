'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { TemplateList } from '@/components/templates/TemplateList'
import { AITemplateGenerator } from '@/components/templates/AITemplateGenerator'
import { useRouter } from 'next/navigation'

export default function TemplatesPage() {
    const router = useRouter()

    const handleAIGenerated = (content: string) => {
        // Store content in localStorage to pass to new page
        localStorage.setItem('ai_generated_template', content)
        router.push('/templates/new?source=ai')
    }

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Templates</h2>
                    <p className="text-muted-foreground">
                        Manage your legal document templates
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <AITemplateGenerator onGenerate={handleAIGenerated} />
                    <Link href="/templates/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> New Template
                        </Button>
                    </Link>
                </div>
            </div>

            <TemplateList />
        </div>
    )
}

