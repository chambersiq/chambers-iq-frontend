'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useClients } from '@/hooks/api/useClients'
import { useCases, useCase } from '@/hooks/api/useCases'
import { useTemplates, useTemplate } from '@/hooks/api/useTemplates'
import { useCreateDraft } from '@/hooks/api/useDrafts'
import { toast } from 'sonner'
import api from '@/lib/api' // Direct API access for one-off fetches if needed, or better use queryClient/hooks
import { useMasterData } from '@/contexts/MasterDataContext'

export default function NewDraftPage() {
    const router = useRouter()
    const { user } = useAuth()
    const companyId = user?.companyId || ''
    const { data: masterData } = useMasterData()

    // State
    const [clientId, setClientId] = useState<string>('')
    const [caseId, setCaseId] = useState<string>('')
    const [docName, setDocName] = useState('')
    const [documentTypeId, setDocumentTypeId] = useState<string>('')
    const [templateId, setTemplateId] = useState<string>('blank')
    const [startingPoint, setStartingPoint] = useState<'template' | 'scratch'>('template')
    const [userInstructions, setUserInstructions] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Data Hooks
    const { data: clients = [] } = useClients(companyId)
    const { data: cases = [], isLoading: isLoadingCases } = useCases(companyId, clientId)
    const { data: templates = [] } = useTemplates(companyId)
    const createDraft = useCreateDraft(companyId)

    // DEBUGGING
    console.log('[NewDraftPage] Debug Info:', {
        user,
        companyId,
        clientsCount: clients.length,
        casesCount: cases.length,
        isCasesLoading: isLoadingCases
    })

    // Filter templates based on documentTypeId
    // Templates also have documentTypeId now.
    // If template has NO documentTypeId (legacy), maybe we can't filter easily, or we default to showing all?
    // Let's filter: Show templates matching documentTypeId OR generic templates
    const filteredTemplates = templates.filter(t => {
        if (!documentTypeId) return true

        // Exact match on new field
        if (t.documentTypeId === documentTypeId) return true

        // Also include templates linked to 'General' or blank if user hasn't selected a type? 
        // No, if user selected a type, we usually want specific templates.

        return false
    })

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!caseId || !docName) {
            toast.error('Please fill in all required fields')
            return
        }

        setIsSubmitting(true)

        try {
            let initialContent = ''

            // 1. Fetch Case Details for Context
            const selectedCase = cases.find(c => c.caseId === caseId)
            const selectedClient = clients.find(c => c.clientId === clientId)
            const clientName = selectedClient
                ? (selectedClient.clientType === 'individual' ? selectedClient.fullName : selectedClient.companyName)
                : 'Unknown Client'

            const header = `CASE: ${selectedCase?.caseName || 'Unknown Case'}
CLIENT: ${clientName}
DATE: ${new Date().toLocaleDateString()}
--------------------------------------------------\n\n`

            initialContent += header

            // 2. Fetch Template Content if selected
            if (templateId !== 'blank') {
                try {
                    // Manual fetch for template content to avoid hook rules issues or waiting
                    const { data: templateData } = await api.get(`/templates/${templateId}`)
                    if (templateData && templateData.content) {
                        initialContent += templateData.content
                    }
                } catch (err) {
                    console.error('Failed to fetch template', err)
                    toast.error('Failed to load template content, starting with blank draft.')
                }
            }

            // 3. Create Draft
            const newDraft = await createDraft.mutateAsync({
                caseId,
                data: {
                    name: docName,
                    caseId: caseId, // Required by backend schema
                    content: initialContent,
                    status: 'draft',
                    clientId: clientId, // Backend should handle this or we send it
                    templateId: templateId !== 'blank' ? templateId : undefined,
                    documentTypeId: documentTypeId || undefined, // Clean empty string
                    userInstructions: startingPoint === 'scratch' ? userInstructions : undefined
                }
            })

            toast.success('Draft created successfully')
            router.push(`/drafts/${newDraft.draftId}`)

        } catch (error) {
            console.error('Failed to create draft', error)
            toast.error('Failed to create draft')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/drafts">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Start New Draft</h1>
                    <p className="mt-2 text-slate-600">
                        Choose a case and document type to begin.
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Draft Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreate} className="space-y-6">
                        {/* Client Selection */}
                        <div className="space-y-2">
                            <Label>Select Client <span className="text-red-500">*</span></Label>
                            <Select value={clientId} onValueChange={setClientId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a client..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {clients
                                        .filter(client => client.totalCases > 0)
                                        .map(client => {
                                            // Handle union type display
                                            const displayName = client.clientType === 'individual'
                                                ? client.fullName
                                                : client.companyName

                                            return (
                                                <SelectItem key={client.clientId} value={client.clientId}>
                                                    {displayName}
                                                </SelectItem>
                                            )
                                        })}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Case Selection (Dependent on Client) */}
                        <div className="space-y-2">
                            <Label>Select Case <span className="text-red-500">*</span></Label>
                            <Select value={caseId} onValueChange={setCaseId} disabled={!clientId || isLoadingCases}>
                                <SelectTrigger>
                                    <SelectValue placeholder={isLoadingCases ? "Loading cases..." : "Select a case..."} />
                                </SelectTrigger>
                                <SelectContent>
                                    {cases.map(c => (
                                        <SelectItem key={c.caseId} value={c.caseId}>
                                            {c.caseName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Document Name */}
                        <div className="space-y-2">
                            <Label>Document Name <span className="text-red-500">*</span></Label>
                            <Input
                                placeholder="e.g. Motion to Compel Discovery"
                                value={docName}
                                onChange={(e) => setDocName(e.target.value)}
                            />
                        </div>

                        {/* Document Type (Filters Templates) */}
                        {masterData && (
                            <div className="space-y-2">
                                <Label>Document Type</Label>
                                <Select value={documentTypeId} onValueChange={(val) => { setDocumentTypeId(val); setTemplateId('blank'); }}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {masterData.document_types.map(type => (
                                            <SelectItem key={type.id} value={type.id}>
                                                {type.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Starting Point Selection */}
                        <div className="space-y-4">
                            <Label>Starting Point</Label>
                            <RadioGroup value={startingPoint} onValueChange={(val: 'template' | 'scratch') => {
                                setStartingPoint(val)
                                if (val === 'scratch') setTemplateId('blank')
                            }} className="grid grid-cols-2 gap-4">
                                <div>
                                    <RadioGroupItem value="template" id="sp-template" className="peer sr-only" />
                                    <Label
                                        htmlFor="sp-template"
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                    >
                                        <div className="mb-2 text-2xl">📄</div>
                                        <div className="font-semibold">Use Template</div>
                                    </Label>
                                </div>
                                <div>
                                    <RadioGroupItem value="scratch" id="sp-scratch" className="peer sr-only" />
                                    <Label
                                        htmlFor="sp-scratch"
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                    >
                                        <div className="mb-2 text-2xl">⚡️</div>
                                        <div className="font-semibold">Start from Scratch</div>
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Conditional Inputs based on Starting Point */}
                        {startingPoint === 'template' ? (
                            <div className="space-y-2">
                                <Label>Select Template</Label>
                                <Select value={templateId} onValueChange={setTemplateId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select template..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredTemplates.map(t => (
                                            <SelectItem key={t.templateId} value={t.templateId}>
                                                {t.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Label>Brief / Instructions (Optional)</Label>
                                <Textarea
                                    placeholder="Briefly describe what you want to draft. The AI will use this to help you get started."
                                    value={userInstructions}
                                    onChange={(e) => setUserInstructions(e.target.value)}
                                    className="resize-none h-32"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Provide key points, specific clauses, or tone instructions.
                                </p>
                            </div>
                        )}

                        <div className="flex justify-end gap-4 pt-4">
                            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button type="submit" className="gap-2" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                                Start Drafting
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
