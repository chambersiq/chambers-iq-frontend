'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TemplateEditor } from '@/components/templates/TemplateEditor'
import { AITemplateGenerator } from '@/components/templates/AITemplateGenerator'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function NewTemplatePage() {
    const [templateContent, setTemplateContent] = useState('')

    const handleAIGenerated = (content: string) => {
        setTemplateContent(content)
    }

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-4">
                    <Link href="/templates">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="flex-1">
                        <Input
                            className="text-lg font-semibold border-none shadow-none px-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground"
                            placeholder="Untitled Template"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <AITemplateGenerator onGenerate={handleAIGenerated} />
                    <Button>
                        <Save className="mr-2 h-4 w-4" />
                        Save Template
                    </Button>
                </div>
            </div>

            {/* Editor */}
            <TemplateEditor value={templateContent} onChange={setTemplateContent} />
        </div>
    )
}
