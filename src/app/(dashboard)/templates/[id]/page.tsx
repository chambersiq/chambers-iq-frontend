'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { DOCUMENT_TYPES } from '@/lib/constants'
import { Input } from '@/components/ui/input'
import { TemplateEditor } from '@/components/templates/TemplateEditor'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useTemplate } from '@/hooks/api/useTemplates'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { TemplateCategory } from '@/types/template'

export default function EditTemplatePage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const { user } = useAuth()
    const { data: template, isLoading, error } = useTemplate(user?.companyId || '', params.id)

    const [name, setName] = useState('')
    const [content, setContent] = useState('')
    const [category, setCategory] = useState<TemplateCategory>('other')
    const [description, setDescription] = useState('')
    const [isSaving, setIsSaving] = useState(false)

    // Load initial data
    useEffect(() => {
        if (template) {
            setName(template.name)
            setContent(template.content)
            setCategory(template.category)
            setDescription(template.description || '')
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
                description,
                category,
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
            <div className="flex flex-col space-y-4 border-b pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                        <Link href="/templates">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Input
                            className="text-lg font-semibold border-none shadow-none px-0 h-auto focus-visible:ring-0 max-w-sm"
                            placeholder="Template Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 mr-4">
                            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Document Type:</span>
                            <Select value={category} onValueChange={(v) => setCategory(v as TemplateCategory)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {DOCUMENT_TYPES.map(type => (
                                        <SelectItem key={type.value} value={type.category}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Changes
                        </Button>
                    </div>
                </div>

                {/* Description / AI Instructions */}
                <div className="px-12">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Description (Also used as AI context)</p>
                    <Textarea
                        placeholder="Describe this template. The AI will use this description to understand when and how to use this template."
                        className="h-20 resize-none text-sm"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
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
