'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TemplateEditor } from '@/components/templates/TemplateEditor'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/api/useCompany'
import { useTemplate } from '@/hooks/api/useTemplates'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

export default function EditTemplatePage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const { user } = useAuth()
    const { data: template, isLoading, error } = useTemplate(user?.companyId || '', params.id)

    const [name, setName] = useState('')
    const [content, setContent] = useState('')
    const [isSaving, setIsSaving] = useState(false)

    // Load initial data
    useEffect(() => {
        if (template) {
            setName(template.name)
            setContent(template.content)
        }
    }, [template]) // Run when template loads

    const handleSave = async () => {
        if (!name.trim()) return toast.error("Name is required")
        if (!content.trim()) return toast.error("Content cannot be empty")

        setIsSaving(true)
        try {
            await api.put(`/companies/${user?.companyId}/templates/${params.id}`, {
                name,
                content,
                description: template?.description,
                category: template?.category,
                variables: template?.variables
            })
            toast.success("Template saved successfully")
        } catch (err) {
            console.error(err)
            toast.error("Failed to save template")
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-4 text-center">
                <p className="text-red-500 font-medium">Failed to load template</p>
                <Link href="/templates">
                    <Button variant="outline">Go Back</Button>
                </Link>
            </div>
        )
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
                            className="text-lg font-semibold border-none shadow-none px-0 h-auto focus-visible:ring-0"
                            placeholder="Template Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            {/* Editor */}
            <TemplateEditor
                value={content}
                onChange={setContent}
            />
        </div>
    )
}
