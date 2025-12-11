'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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

import { DOCUMENT_TYPES } from '@/lib/constants'

export default function NewDraftPage() {
    const router = useRouter()
    const { user } = useAuth()
    const companyId = user?.companyId || ''

    // State
    const [clientId, setClientId] = useState<string>('')
    const [caseId, setCaseId] = useState<string>('')
    const [docName, setDocName] = useState('')
    const [docType, setDocType] = useState<string>('') // 'contract' | 'pleading' | ...
    const [templateId, setTemplateId] = useState<string>('blank')
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
    if (clients.length > 0) console.log('[NewDraftPage] Sample Client:', clients[0])




    // Filter templates based on docType
    const filteredTemplates = templates.filter(t => {
        if (!docType) return true
        const selectedType = DOCUMENT_TYPES.find(d => d.value === docType)
        if (selectedType) return t.category === selectedType.category
        return true
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
            // We can't use useCase hook here conditionally easily, so we might need to fetch manually or rely on list data if sufficient.
            // List data `cases` has basic info. For full details we might need a fetch.
            // For MVP, constructing header from Case Name/Client Name is good start.

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
                    documentType: DOCUMENT_TYPES.find(d => d.value === docType)?.label || docType
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
                        <div className="space-y-2">
                            <Label>Document Type</Label>
                            <Select value={docType} onValueChange={(val) => { setDocType(val); setTemplateId('blank'); }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {DOCUMENT_TYPES.map(type => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Template Selection */}
                        <div className="space-y-2">
                            <Label>Starting Point</Label>
                            <Select value={templateId} onValueChange={setTemplateId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select template..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="blank">Blank Document</SelectItem>
                                    {filteredTemplates.map(t => (
                                        <SelectItem key={t.templateId} value={t.templateId}>
                                            {t.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

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
