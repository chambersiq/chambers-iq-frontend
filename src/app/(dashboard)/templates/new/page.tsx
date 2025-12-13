'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { TemplateEditor } from '@/components/templates/TemplateEditor'
import { ArrowLeft, Save, Sparkles, Send, RefreshCw, MessageSquare, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCreateTemplate, useGetWorkflowStatus, useReviewWorkflow } from '@/hooks/api/useTemplates'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { useMasterData } from '@/contexts/MasterDataContext'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


function NewTemplateContent() {
    const queryClient = useQueryClient()
    const router = useRouter()
    const searchParams = useSearchParams()
    const { user } = useAuth()
    const companyId = user?.companyId || ''
    const createTemplate = useCreateTemplate(companyId)

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [documentTypeId, setDocumentTypeId] = useState('')
    const [courtLevelId, setCourtLevelId] = useState('')
    const [caseTypeId, setCaseTypeId] = useState('')
    const [templateContent, setTemplateContent] = useState('')

    const { data: masterData } = useMasterData()

    const threadId = searchParams.get('thread_id')
    const { data: workflowStatus } = useGetWorkflowStatus(threadId)
    const reviewWorkflow = useReviewWorkflow(threadId || '')

    // AI State
    const [isAIMode, setIsAIMode] = useState(false)
    const [chatInput, setChatInput] = useState('')
    const [isRegenerating, setIsRegenerating] = useState(false)
    const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai', content: string }[]>([])
    // const chatEndRef = useRef<HTMLDivElement>(null) // Deprecated
    const chatContainerRef = useRef<HTMLDivElement>(null)


    // UI State for Feedback
    const [isProvidingFeedback, setIsProvidingFeedback] = useState(false)

    // Auto-scroll
    useEffect(() => {
        // Small timeout to ensure DOM has updated with new heights
        const timeoutId = setTimeout(() => {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
            }
        }, 100)
        return () => clearTimeout(timeoutId)
    }, [chatHistory, workflowStatus?.status, isProvidingFeedback, reviewWorkflow.isPending])

    // Sync workflow state
    useEffect(() => {
        if (workflowStatus?.template) {
            // If in review or completed, update content
            if (workflowStatus.status === 'awaiting_attorney_review' || workflowStatus.status === 'completed') {
                setTemplateContent(workflowStatus.template)
            }

            // Add completion message to chat if not already present
            if (workflowStatus.status === 'completed') {
                setChatHistory(prev => {
                    const lastMsg = prev[prev.length - 1]
                    const completionMsg = 'Template generation complete! You can now review the document in the editor.'
                    if (lastMsg?.content !== completionMsg) {
                        return [...prev, { role: 'ai', content: completionMsg }]
                    }
                    return prev
                })
            }
        }
        // If there's a revision summary and we haven't shown it yet
        // We check the last message. If it's from user, or if it's "Understood...", then we append.
        // @ts-ignore
        // @ts-ignore
        if (workflowStatus?.revisionSummary) {
            setChatHistory(prev => {
                const lastMsg = prev[prev.length - 1]
                // @ts-ignore
                const summary = workflowStatus.revisionSummary

                // Avoid duplicates
                if (lastMsg?.content !== summary) {
                    // Ensure we don't add it if the last message was the "Understood" placeholder and we haven't cleared it?
                    // Actually, just appending is fine.
                    return [...prev, { role: 'ai', content: summary }]
                }
                return prev
            })
        }
    }, [workflowStatus?.template, workflowStatus?.status, workflowStatus]) // Added workflowStatus dependency

    useEffect(() => {
        if (searchParams.get('source') === 'ai') {
            setIsAIMode(true)
            // Legacy mock support
            const aiContent = localStorage.getItem('ai_generated_template')
            if (aiContent) {
                setTemplateContent(aiContent)
                setDescription('Generated from AI prompt')
                setChatHistory([{ role: 'ai', content: 'I have generated a draft based on your prompt.' }])
                localStorage.removeItem('ai_generated_template')
            }
        }
    }, [searchParams])

    const handleApprove = () => {
        reviewWorkflow.mutate({ approved: true, feedback: chatInput }, {
            onSuccess: () => {
                toast.success("Template approved! Generating final variables...")
                setChatHistory(prev => [...prev, { role: 'user', content: 'Approved' }, { role: 'ai', content: 'Proceeding to variable collection...' }])
                queryClient.invalidateQueries({ queryKey: ['workflow', threadId] })
            }
        })
    }

    const handleReject = () => {
        // Step 1: Switch to input mode
        setIsProvidingFeedback(true)
    }

    const handleSubmitFeedback = () => {
        // Step 2: Submit feedback
        if (!chatInput) {
            toast.error("Please describe the changes needed.")
            return
        }

        reviewWorkflow.mutate({ approved: false, feedback: chatInput }, {
            onSuccess: () => {
                setChatHistory(prev => [...prev, { role: 'user', content: 'Changes requested: ' + chatInput }, { role: 'ai', content: 'Understood. Revising the template...' }])
                setChatInput('')
                setIsProvidingFeedback(false) // Exit input mode, UI will show pending/processing state
                queryClient.invalidateQueries({ queryKey: ['workflow', threadId] })
            }
        })
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
        if (!documentTypeId || !courtLevelId || !caseTypeId) {
            toast.error("Please select document type, court level, and case type")
            return
        }

        createTemplate.mutate({
            name,
            description,
            content: templateContent,
            variables: [], // TODO: Extract variables from content
            isSystem: false,
            documentTypeId,
            courtLevelId,
            caseTypeId,
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

    // Keep legacy regenerate for non-workflow AI
    const handleRegenerate = () => {
        if (!chatInput) {
            toast.error("Please provide instructions")
            return
        }
        setIsRegenerating(true)
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
                            className="text-lg h-10 w-[400px]"
                            placeholder={isAIMode ? "AI Generated Template Name" : "Template Name"}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <div className="flex items-center gap-2">
                            {/* Document Type */}
                            <Select value={documentTypeId} onValueChange={setDocumentTypeId}>
                                <SelectTrigger className="w-[140px] h-8 text-xs">
                                    <SelectValue placeholder="Document Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {masterData?.document_types.map((dt) => (
                                        <SelectItem key={dt.id} value={dt.id}>
                                            {dt.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Court Level */}
                            <Select value={courtLevelId} onValueChange={setCourtLevelId}>
                                <SelectTrigger className="w-[120px] h-8 text-xs">
                                    <SelectValue placeholder="Court Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    {masterData?.court_levels.map((cl) => (
                                        <SelectItem key={cl.id} value={cl.id}>
                                            {cl.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Case Type */}
                            <Select value={caseTypeId} onValueChange={setCaseTypeId}>
                                <SelectTrigger className="w-[120px] h-8 text-xs">
                                    <SelectValue placeholder="Case Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {masterData?.case_types.map((ct) => (
                                        <SelectItem key={ct.id} value={ct.id}>
                                            {ct.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Input
                                className="h-8 text-xs w-[200px]"
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
                                {threadId ? 'Template Architect' : 'AI Assistant'}
                            </h3>
                            {workflowStatus && (
                                <div className="mt-2 p-2 bg-slate-50 rounded border text-xs space-y-1">
                                    <div className="flex justify-between">
                                        <span className="font-medium">Status:</span>
                                        <span className="capitalize text-blue-600">{workflowStatus.status?.replace(/_/g, ' ')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Step:</span>
                                        <span className="capitalize">{workflowStatus.currentStep}</span>
                                    </div>
                                </div>
                            )}
                            {/* <div ref={chatEndRef} />Container-based scrolling is more reliable */}
                            {!threadId && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    Chat with AI to refine this template.
                                </p>
                            )}
                        </div>

                        {/* Chat / Status History */}
                        <div
                            ref={chatContainerRef}
                            className="flex-1 overflow-y-auto pr-4 mb-4 min-h-0"
                        >
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
                                {workflowStatus?.status === 'awaiting_attorney_review' && !isProvidingFeedback && !reviewWorkflow.isPending && (
                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
                                        <p className="font-medium text-amber-800 mb-2">Review Required</p>
                                        <p className="text-amber-700 mb-2">Please review the drafted template. You can request changes or approve it.</p>
                                        <div className="flex gap-2">
                                            <Button size="sm" onClick={handleApprove} className="w-full bg-green-600 hover:bg-green-700">Approve</Button>
                                            <Button size="sm" variant="outline" onClick={handleReject} className="w-full text-red-600 hover:text-red-700">Updates Needed</Button>
                                        </div>
                                    </div>
                                )}
                                {reviewWorkflow.isPending && (
                                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm flex items-center gap-3">
                                        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                        <span className="text-blue-700">Agent is revising...</span>
                                    </div>
                                )}
                                {workflowStatus?.status === 'completed' && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
                                        <p className="font-medium text-green-800 mb-2">Workflow Complete</p>
                                        <p className="text-green-700 mb-2">The template has been finalized based on your samples.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="flex-shrink-0 mt-auto space-y-2 pb-1">
                            {/* Only show input if NOT in explicit review mode (unless providing feedback) OR if not workflow at all */}
                            {(!threadId || isProvidingFeedback) && (
                                <>
                                    <Textarea
                                        placeholder={isProvidingFeedback ? "Describe the changes needed..." : "Instructions..."}
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        className="min-h-[80px] resize-none"
                                        disabled={reviewWorkflow.isPending}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault()
                                                if (threadId && isProvidingFeedback) {
                                                    handleSubmitFeedback()
                                                } else if (!threadId && !isRegenerating && chatInput) {
                                                    handleRegenerate()
                                                }
                                            }
                                        }}
                                    />
                                    <div className="flex gap-2">
                                        {isProvidingFeedback && (
                                            <Button variant="ghost" size="sm" onClick={() => setIsProvidingFeedback(false)} disabled={reviewWorkflow.isPending}>Cancel</Button>
                                        )}
                                        <Button
                                            className="w-full"
                                            variant="outline"
                                            onClick={threadId ? handleSubmitFeedback : handleRegenerate}
                                            disabled={isRegenerating || reviewWorkflow.isPending || !chatInput}
                                        >
                                            {reviewWorkflow.isPending || isRegenerating ? (
                                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                <Sparkles className="mr-2 h-4 w-4 text-purple-600" />
                                            )}
                                            {threadId ? 'Submit Feedback' : (isRegenerating ? 'Regenerating...' : 'Regenerate with AI')}
                                        </Button>
                                    </div>
                                </>
                            )}

                            {/* Show simple status button if waiting for user action (and not providing feedback) */}
                            {threadId && !isProvidingFeedback && workflowStatus?.status !== 'completed' && (
                                <Button
                                    className="w-full"
                                    variant="ghost"
                                    disabled
                                >
                                    {reviewWorkflow.isPending ? 'Processing...' : 'Agent Active...'}
                                </Button>
                            )}

                            {workflowStatus?.status === 'completed' && (
                                <Button className="w-full" variant="ghost" disabled>
                                    <span className="flex items-center text-green-600">
                                        <Sparkles className="h-4 w-4 mr-2" />
                                        Done
                                    </span>
                                </Button>
                            )}
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
