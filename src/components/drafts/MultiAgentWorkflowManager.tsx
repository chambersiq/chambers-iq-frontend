'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { useStartWorkflow, useWorkflowStatus, useResumeWorkflow } from '@/hooks/api/useAgentWorkflow'
import { BrainCircuit, Play, CheckCircle2, AlertCircle, Loader2, StopCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useParams } from 'next/navigation'

interface Props {
    caseId: string
    caseType: string
    clientId: string
    onWorkflowComplete?: () => void
    onWorkflowProgress?: (content: string) => void
}

export function MultiAgentWorkflowManager({ caseId, caseType, clientId, onWorkflowComplete, onWorkflowProgress }: Props) {
    const [threadId, setThreadId] = useState<string | null>(null)
    const [feedback, setFeedback] = useState('')

    // Mutations
    const startWorkflow = useStartWorkflow()
    const resumeWorkflow = useResumeWorkflow()

    // Query
    const { data: statusData, isLoading } = useWorkflowStatus(threadId)

    // Side Effect: Trigger completion callback
    const [hasTriggeredCompletion, setHasTriggeredCompletion] = useState(false)
    const isCompleted = statusData?.status === 'completed'

    if (isCompleted && !hasTriggeredCompletion && onWorkflowComplete) {
        onWorkflowComplete()
        setHasTriggeredCompletion(true)
    }

    // Side Effect: Stream partial draft content
    useEffect(() => {
        if (!statusData?.current_state?.section_memory || !onWorkflowProgress) return

        // Construct draft from completed sections
        const memory = statusData.current_state.section_memory
        const plan = statusData.current_state.plan

        if (memory.length > 0) {
            const htmlContent = memory.map((sec: any) => {
                // Look up title from plan if available
                let title = sec.title
                if (!title && plan?.sections) {
                    const planSection = plan.sections.find((s: any) => s.id === sec.section_id)
                    if (planSection) title = planSection.title
                }
                return `<h2>${title || 'Section'}</h2>${sec.content}`
            }).join('<br/><br/>')
            onWorkflowProgress(htmlContent)
        }
    }, [statusData?.current_state?.section_memory, statusData?.current_state?.plan, onWorkflowProgress])

    const handleStart = async () => {
        try {
            const result = await startWorkflow.mutateAsync({
                case_id: caseId,
                case_type: caseType || 'general',
                client_id: clientId || 'unknown'
            })
            setThreadId(result.thread_id)
            setHasTriggeredCompletion(false) // Reset for new run
            toast.success('Agent Workflow Started')
        } catch (e) {
            toast.error('Failed to start workflow')
        }
    }

    const handleReview = async (verdict: 'approve' | 'reject' | 'refine') => {
        if (!threadId) return
        try {
            await resumeWorkflow.mutateAsync({
                threadId,
                verdict,
                feedback: verdict === 'approve' ? undefined : feedback
            })
            setFeedback('')
            toast.success(`Sent verdict: ${verdict}`)
        } catch (e) {
            toast.error('Failed to resume workflow')
        }
    }

    const currentState = statusData?.current_state
    const isInterrupted = statusData?.status === 'interrupted_for_human'
    const isRunning = statusData?.status === 'running'

    return (
        <div className="flex flex-col h-full bg-slate-50">
            <div className="p-4 border-b bg-white">
                <h3 className="font-semibold flex items-center gap-2">
                    <BrainCircuit className="h-5 w-5 text-indigo-600" />
                    Agent Orchestrator
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                    Multi-agent autonomous drafting system
                </p>
            </div>

            <ScrollArea className="flex-1 p-4">
                {/* Start State */}
                {!threadId && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Start Drafting</CardTitle>
                            <CardDescription>
                                Initialize the agent team to draft this document.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                onClick={handleStart}
                                disabled={startWorkflow.isPending}
                                className="w-full bg-indigo-600 hover:bg-indigo-700"
                            >
                                {startWorkflow.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                                Start Workflow
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Status State */}
                {threadId && (
                    <div className="space-y-4">
                        <Card className="border-indigo-100">
                            <CardContent className="pt-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-slate-600">Status</span>
                                    <Badge variant={isInterrupted ? 'warning' : isRunning ? 'default' : isCompleted ? 'success' : 'secondary'} className={isRunning ? 'bg-indigo-600' : isCompleted ? 'bg-green-600' : ''}>
                                        {statusData?.status || 'Unknown'}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-600">Current Agent</span>
                                    <span className="text-sm font-mono bg-slate-100 px-2 py-1 rounded">
                                        {isCompleted ? 'Done' : (statusData?.current_node || 'Initializing...')}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Plan Visualization */}
                        {currentState?.plan && (
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm">Drafting Plan</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="text-xs text-muted-foreground mb-2">
                                        {isCompleted ? currentState.plan.total_estimated_sections : currentState.completed_section_ids?.length} / {currentState.plan.total_estimated_sections} Sections
                                    </div>
                                    {currentState.plan.sections.map((section: any, idx: number) => {
                                        const isCompletedSection = isCompleted || currentState.completed_section_ids?.includes(section.id)
                                        const isCurrent = !isCompleted && idx === currentState.current_section_idx
                                        return (
                                            <div key={section.id} className={`flex items-center gap-2 text-sm p-2 rounded ${isCurrent ? 'bg-indigo-50 border border-indigo-200' : 'bg-white'}`}>
                                                {isCompletedSection ? <CheckCircle2 className="h-4 w-4 text-green-500" /> :
                                                    isCurrent ? <Loader2 className="h-4 w-4 text-indigo-500 animate-spin" /> :
                                                        <div className="h-4 w-4 rounded-full border border-slate-300" />}
                                                <span className={isCompletedSection ? 'line-through text-slate-400' : ''}>{section.title}</span>
                                            </div>
                                        )
                                    })}
                                </CardContent>
                            </Card>
                        )}

                        <Card className="bg-slate-950 text-slate-300 border-none shadow-inner">
                            <CardHeader className="p-3 pb-0">
                                <CardTitle className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Live Agent Activity</CardTitle>
                            </CardHeader>
                            <CardContent className="p-3 text-xs font-mono h-40 overflow-y-auto space-y-1">
                                <p className="text-slate-500">{`> Workflow init: ${threadId?.substring(0, 8)}...`}</p>

                                {currentState?.workflow_logs?.map((log: any, idx: number) => (
                                    <div key={idx} className="flex gap-2">
                                        <span className="text-indigo-400 shrink-0">[{log.agent}]</span>
                                        <span className="text-slate-300">{log.message}</span>
                                    </div>
                                ))}

                                {statusData?.current_node && <p className="text-slate-500 animate-pulse">{`> Active: ${statusData.current_node}...`}</p>}
                                {isInterrupted && <p className="text-yellow-400 font-bold">{`> ⚠️ WAITING FOR HUMAN REVIEW`}</p>}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </ScrollArea>

            {/* Human in the loop - Sidebar Bottom */}
            {isInterrupted && (
                <div className="p-4 border-t bg-yellow-50">
                    <div className="flex items-center gap-2 mb-2 text-yellow-800 font-semibold">
                        <AlertCircle className="h-4 w-4" /> Action Required: Reviewer Loop
                    </div>
                    <p className="text-xs text-yellow-700 mb-3">
                        The agent is stuck refactoring this section. Please intervene.
                    </p>

                    <div className="bg-white p-3 rounded border border-red-100 bg-red-50/50 mb-3 text-xs text-slate-700 whitespace-pre-wrap">
                        <span className="font-semibold block mb-1 text-red-800">Reviewer Feedback:</span>
                        {currentState?.human_readable_feedback || "No feedback available."}
                    </div>

                    <div className="bg-white p-2 rounded border mb-3 text-xs max-h-[150px] overflow-y-auto text-slate-600 font-mono">
                        <span className="font-semibold block mb-1 text-slate-400 text-[10px] uppercase">Draft Preview</span>
                        {currentState?.draft_preview || currentState?.current_draft?.content || "Content preview unavailable..."}
                    </div>

                    <div className="space-y-3">
                        {/* Option 1: Approve (Force) */}
                        <div className="bg-white p-2 rounded border border-green-200">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-semibold text-green-700">Option 1: Force Approval</span>
                                <Button className="bg-green-600 hover:bg-green-700 text-xs h-6" size="sm" onClick={() => handleReview('approve')}>
                                    Approve & Continue
                                </Button>
                            </div>
                            <p className="text-[10px] text-slate-500">Ignore issues and proceed to next section.</p>
                        </div>

                        {/* Option 2: Provide Guidance */}
                        <div className="bg-white p-2 rounded border border-blue-200">
                            <span className="text-xs font-semibold text-blue-700 block mb-1">Option 2: Guide & Retry</span>
                            <Textarea
                                placeholder="E.g. 'Add the court name explicitly' or 'Remove the second paragraph'..."
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                className="mb-2 text-xs min-h-[50px]"
                            />
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1 text-xs h-7 border-blue-200 text-blue-700 hover:bg-blue-50" onClick={() => handleReview('refine')}>
                                    Submit Guidance
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 text-xs h-7 border-red-200 text-red-700 hover:bg-red-50" onClick={() => handleReview('reject')}>
                                    Reject & Rewrite
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

