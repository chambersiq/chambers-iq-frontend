'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { TemplateEditor } from '@/components/templates/TemplateEditor'
import { ArrowLeft, Save, Sparkles, Send, RefreshCw, MessageSquare, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
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


function NewTemplateContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { user } = useAuth()
    const companyId = user?.companyId || ''
    const createTemplate = useCreateTemplate(companyId)

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState<TemplateCategory>('other')
    const [templateContent, setTemplateContent] = useState('')

    // AI State
    const [isAIMode, setIsAIMode] = useState(false)
    const [chatInput, setChatInput] = useState('')
    const [isRegenerating, setIsRegenerating] = useState(false)
    const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai', content: string }[]>([])

    useEffect(() => {
        if (searchParams.get('source') === 'ai') {
            setIsAIMode(true)
            const aiContent = localStorage.getItem('ai_generated_template')
            if (aiContent) {
                setTemplateContent(aiContent)
                // setName('AI Generated Template') // Removed to show placeholder instead
                setDescription('Generated from AI prompt')
                setChatHistory([{ role: 'ai', content: 'I have generated a draft based on your prompt. You can ask me to make changes or regenerate it.' }])
                // Clean up
                localStorage.removeItem('ai_generated_template')
                toast.success("AI content loaded")
            }
        }
    }, [searchParams])

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

    const handleRegenerate = () => {
        if (!chatInput) {
            toast.error("Please provide instructions for regeneration")
            return
        }

        setIsRegenerating(true)
        // Simulate API call
        setTimeout(() => {
            setIsRegenerating(false)
            setTemplateContent(prev => prev + `\n\n[Updated based on: "${chatInput}"]`)
            setChatHistory(prev => [
                ...prev,
                { role: 'user', content: chatInput },
                { role: 'ai', content: 'I have updated the template based on your feedback.' }
            ])
            setChatInput('')
            toast.success("Template updated")
        }, 2000)
    }

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
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
                            className="text-lg h-10 w-[400px]" // Removed font-semibold
                            placeholder={isAIMode ? "AI Generated Template Name" : "Template Name"}
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
                    {isAIMode && (
                        <div className="flex items-center gap-2 mr-4 border-r pr-4">
                            <div className="flex items-center text-sm text-purple-600 font-medium">
                                <Sparkles className="mr-2 h-4 w-4" />
                                AI Assistant Active
                            </div>
                        </div>
                    )}
                    <Button onClick={handleSave} disabled={createTemplate.isPending}>
                        <Save className="mr-2 h-4 w-4" />
                        {createTemplate.isPending ? 'Saving...' : 'Save Template'}
                    </Button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
                {/* Editor */}
                <div className="flex-1 flex flex-col min-w-0 h-full">
                    <TemplateEditor value={templateContent} onChange={setTemplateContent} />
                </div>

                {/* AI Sidebar (Conditional) */}
                {isAIMode && (
                    <div className="w-80 flex-shrink-0 flex flex-col border-l pl-6 h-full overflow-hidden">
                        <div className="mb-4 flex-shrink-0">
                            <h3 className="font-semibold flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                AI Refinement
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1">
                                Chat with AI to refine this template.
                            </p>
                        </div>

                        {/* Chat History */}
                        <div className="flex-1 overflow-y-auto pr-4 mb-4 min-h-0">
                            <div className="space-y-4">
                                {chatHistory.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`rounded-lg px-3 py-2 text-sm max-w-[90%] ${msg.role === 'user'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-slate-100 text-slate-900'
                                            }`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="flex-shrink-0 mt-auto space-y-2 pb-1">
                            <Textarea
                                placeholder="Instructions (e.g., 'Add a liability clause')"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                className="min-h-[80px] resize-none"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault()
                                        if (!isRegenerating && chatInput) {
                                            handleRegenerate()
                                        }
                                    }
                                }}
                            />
                            <Button
                                className="w-full"
                                variant="outline"
                                onClick={handleRegenerate}
                                disabled={isRegenerating || !chatInput}
                            >
                                {isRegenerating ? (
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Sparkles className="mr-2 h-4 w-4 text-purple-600" />
                                )}
                                {isRegenerating ? 'Regenerating...' : 'Regenerate with AI'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default function NewTemplatePage() {
    return (
        <Suspense fallback={
            <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        }>
            <NewTemplateContent />
        </Suspense>
    )
}
