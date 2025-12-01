'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TemplateEditor } from '@/components/templates/TemplateEditor'
import { AITemplateGenerator } from '@/components/templates/AITemplateGenerator'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCreateTemplate } from '@/hooks/api/useTemplates'
import { useAuth } from '@/hooks/api/useCompany'
import { toast } from 'sonner'
import { TemplateCategory } from '@/types/template'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
export default function NewTemplatePage() {
    const router = useRouter()
    const { user } = useAuth()
    const companyId = user?.companyId || ''
    const createTemplate = useCreateTemplate(companyId)

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState<TemplateCategory>('other')
    const [templateContent, setTemplateContent] = useState('')

    const handleAIGenerated = (content: string) => {
        setTemplateContent(content)
    }

    const handleSave = () => {
        if (!name) {
            toast.error("Template name is required")
            return
        }
        if (!templateContent) {
            toast.error("Template content is empty")
            return
        }

        createTemplate.mutate({
            name,
            description,
            category,
            content: templateContent,
            variables: [], // TODO: Extract variables from content
            isSystem: false,
            createdBy: user?.fullName || user?.email || 'Unknown User'
        }, {
            onSuccess: () => {
                toast.success("Template created successfully")
                router.push('/templates')
            },
            onError: (error) => {
                toast.error("Failed to create template")
                console.error(error)
            }
        })
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
                    <div className="flex-1 space-y-2">
                        <Input
                            className="text-lg font-semibold border-none shadow-none px-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground"
                            placeholder="Untitled Template"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <div className="flex items-center gap-2">
                            <Select value={category} onValueChange={(v) => setCategory(v as TemplateCategory)}>
                                <SelectTrigger className="w-[150px] h-8 text-xs">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="contract">Contract</SelectItem>
                                    <SelectItem value="motion">Motion</SelectItem>
                                    <SelectItem value="pleading">Pleading</SelectItem>
                                    <SelectItem value="letter">Letter</SelectItem>
                                    <SelectItem value="discovery">Discovery</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input
                                className="h-8 text-xs w-[300px]"
                                placeholder="Description (optional)"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <AITemplateGenerator onGenerate={handleAIGenerated} />
                    <Button onClick={handleSave} disabled={createTemplate.isPending}>
                        <Save className="mr-2 h-4 w-4" />
                        {createTemplate.isPending ? 'Saving...' : 'Save Template'}
                    </Button>
                </div>
            </div>

            {/* Editor */}
            <TemplateEditor value={templateContent} onChange={setTemplateContent} />
        </div>
    )
}
