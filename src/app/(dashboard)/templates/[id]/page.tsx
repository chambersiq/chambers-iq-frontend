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
import { Input } from '@/components/ui/input'
import { TemplateEditor } from '@/components/templates/TemplateEditor'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useTemplate } from '@/hooks/api/useTemplates'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

import { useMasterData } from '@/contexts/MasterDataContext'

export default function EditTemplatePage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const { user } = useAuth()
    const { data: template, isLoading, error } = useTemplate(user?.companyId || '', params.id)
    const { data: masterData } = useMasterData()

    const [name, setName] = useState('')
    const [content, setContent] = useState('')
    const [description, setDescription] = useState('')
    const [isSaving, setIsSaving] = useState(false)

    // Phase 2: Categorization State
    const [documentTypeId, setDocumentTypeId] = useState<string>('')
    const [courtLevelId, setCourtLevelId] = useState<string>('')
    const [caseTypeId, setCaseTypeId] = useState<string>('')

    // Load initial data
    useEffect(() => {
        if (template) {
            setName(template.name)
            setContent(template.content)
            setDescription(template.description || '')
            // Set new fields
            setDocumentTypeId(template.documentTypeId || '')
            setCourtLevelId(template.courtLevelId || '')
            setCaseTypeId(template.caseTypeId || '')
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
                variables: template?.variables,
                // Phase 2 fields
                documentTypeId,
                courtLevelId,
                caseTypeId
            })
            toast.success("Template saved successfully")
            router.push('/templates')
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
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Changes
                        </Button>
                    </div>
                </div>

                {/* Description / AI Instructions */}
                {/* Description / AI Instructions */}
                <div className="px-12 grid gap-4">
                    <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Description (Also used as AI context)</p>
                        <Textarea
                            placeholder="Describe this template. The AI will use this description to understand when and how to use this template."
                            className="h-20 resize-none text-sm"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* Phase 2: Categorization */}
                    {masterData && (
                        <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg border">
                            <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground">Document Type</span>
                                <Select value={documentTypeId} onValueChange={setDocumentTypeId}>
                                    <SelectTrigger className="h-8 text-sm">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {masterData.document_types.map(dt => (
                                            <SelectItem key={dt.id} value={dt.id}>{dt.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground">Court Level</span>
                                <Select value={courtLevelId} onValueChange={setCourtLevelId}>
                                    <SelectTrigger className="h-8 text-sm">
                                        <SelectValue placeholder="Select court" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">All Courts</SelectItem>
                                        {masterData.court_levels.map(cl => (
                                            <SelectItem key={cl.id} value={cl.id}>{cl.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground">Case Type</span>
                                <Select value={caseTypeId} onValueChange={setCaseTypeId}>
                                    <SelectTrigger className="h-8 text-sm">
                                        <SelectValue placeholder="Select case type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">All Case Types</SelectItem>
                                        {masterData.case_types.map(ct => (
                                            <SelectItem key={ct.id} value={ct.id}>{ct.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
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
