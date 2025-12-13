'use client'

import { useState, useRef, useEffect } from 'react'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, X, FileText, Sparkles, Plus, Trash2, Filter } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { DocumentType } from '@/types/document'
import { useMasterData } from '@/contexts/MasterDataContext'

// Helper to map Category Name/ID to DocumentType
const getGenericTypeFromCategory = (categoryId: string, categories: any[]): DocumentType => {
    const cat = categories.find(c => c.id === categoryId);
    if (!cat) return 'other';
    const name = cat.name.toLowerCase();

    if (name.includes('pleading')) return 'pleading';
    if (name.includes('application') || name.includes('motion')) return 'motion';
    if (name.includes('evidence')) return 'evidence';
    if (name.includes('contract') || name.includes('agreement')) return 'contract';
    if (name.includes('notice') || name.includes('correspondence')) return 'correspondence';
    if (name.includes('order') || name.includes('judgment')) return 'order';

    return 'other';
}
import { useRouter } from 'next/navigation'
import { useCreateDocumentUrl } from '@/hooks/api/useDocuments'
import { useAuth } from '@/hooks/useAuth'
import { useCompany } from '@/hooks/api/useCompany'
import { useCases } from '@/hooks/api/useCases'
import { useClients } from '@/hooks/api/useClients'
import { useQueryClient } from '@tanstack/react-query'

interface QueueItem {
    id: string
    file: File
    title: string
    type: DocumentType
    summary: string
    aiGenerate: boolean
    progress: number
    caseId?: string
    documentTypeId?: string
}

interface BulkDocumentUploaderProps {
    caseId?: string
    onComplete?: () => void
    cancelHref: string
}

export function BulkDocumentUploader({ caseId, onComplete, cancelHref }: BulkDocumentUploaderProps) {
    const router = useRouter()
    const queryClient = useQueryClient()
    const { user } = useAuth()
    const companyId = user?.companyId || ''

    // Fetch Data
    const { data: cases = [] } = useCases(companyId)
    const { data: clients = [] } = useClients(companyId)

    const [queue, setQueue] = useState<QueueItem[]>([])
    const [isUploading, setIsUploading] = useState(false)

    // Context Selection State
    const [selectedClientId, setSelectedClientId] = useState<string>('')
    const [selectedCaseId, setSelectedCaseId] = useState<string>(caseId || '')

    // Effect: Sync state with prop if it changes
    useEffect(() => {
        if (caseId) {
            setSelectedCaseId(caseId)
        }
    }, [caseId])

    // Filter cases based on selected client
    const filteredCases = selectedClientId
        ? cases.filter((c: any) => c.clientId === selectedClientId)
        : [];

    const { data: masterData } = useMasterData()

    // Form State
    const [title, setTitle] = useState('')
    const [type, setType] = useState<DocumentType>('motion')
    const [documentTypeId, setDocumentTypeId] = useState<string>('')
    const [summary, setSummary] = useState('')
    const [aiGenerate, setAiGenerate] = useState(false)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [dragActive, setDragActive] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const files = Array.from(e.dataTransfer.files)
            setSelectedFiles(prev => [...prev, ...files])
            // Auto-set title from first file if empty
            if (!title && files.length > 0) setTitle(files[0].name.split('.')[0])
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files)
            setSelectedFiles(prev => [...prev, ...files])
            if (!title && files.length > 0) setTitle(files[0].name.split('.')[0])
        }
    }

    const removeSelectedFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    }

    const addToQueue = () => {
        if (selectedFiles.length === 0 || !title) return

        // Validation: Require Case Selection
        if (!selectedCaseId && !caseId) {
            // Ideally assume UI handles this, but good to block
            return
        }

        const newItems: QueueItem[] = selectedFiles.map((file, index) => ({
            id: Math.random().toString(36).substring(7),
            file: file,
            // If multiple files, maybe append index or keep same title? 
            // Let's keep same title for now, user can edit in queue if needed (future feature)
            title: selectedFiles.length > 1 ? `${title} (${index + 1})` : title,
            type,
            summary,
            aiGenerate,
            progress: 0,
            documentTypeId: documentTypeId === 'other' ? undefined : documentTypeId // Don't send 'other' as an ID
        }))

        setQueue(prev => [...prev, ...newItems])

        // Reset Form
        setTitle('')
        setSummary('')
        setSelectedFiles([])
        setAiGenerate(false)
        if (inputRef.current) inputRef.current.value = ''
    }

    const removeFromQueue = (id: string) => {
        setQueue(prev => prev.filter(item => item.id !== id))
    }

    const createDocumentUrl = useCreateDocumentUrl(companyId)

    const handleUploadAll = async () => {
        if (!selectedCaseId) return

        setIsUploading(true)

        // Process uploads sequentially (or parallel if needed, but sequential is safer for now)
        for (const item of queue) {
            try {
                // 1. Get Presigned URL
                const { document, uploadUrl } = await createDocumentUrl.mutateAsync({
                    caseId: selectedCaseId,
                    name: item.file.name,
                    type: item.type,
                    // Pass documentTypeId if available
                    ...(item.documentTypeId ? { documentTypeId: item.documentTypeId } : {}),
                    fileSize: item.file.size,
                    mimeType: item.file.type,
                    description: item.summary,
                    generateSummary: item.aiGenerate
                } as any) // Cast as any because hook type might not be updated yet with documentTypeId optional

                // 2. Upload to S3
                await fetch(uploadUrl, {
                    method: 'PUT',
                    body: item.file,
                    headers: {
                        'Content-Type': item.file.type
                    }
                })

                // 3. Confirm Upload & Trigger AI (if enabled)
                await api.post(`/documents/${document.documentId}/uploaded`)

                // 3. Update Progress to 100%
                setQueue(prev => prev.map(q => q.id === item.id ? { ...q, progress: 100 } : q))

            } catch (error) {
                console.error(`Failed to upload ${item.title}:`, error)
                // TODO: Handle error state in UI
            }
        }

        setIsUploading(false)

        // Invalidate queries to refresh document list
        await queryClient.invalidateQueries({ queryKey: ['documents', companyId, caseId] })

        if (onComplete) {
            onComplete()
        } else {
            router.push(cancelHref)
        }
    }

    return (
        <div className="grid gap-8 lg:grid-cols-12">
            {/* Left Column: The Builder */}
            <div className="lg:col-span-5 space-y-6">
                <Card className="border-2 border-blue-100 shadow-md">
                    <CardHeader className="bg-blue-50/50 border-b border-blue-100">
                        <CardTitle className="flex items-center gap-2 text-blue-900">
                            <Plus className="h-5 w-5" />
                            Add New Document
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">

                        {/* 0. Client & Case Selection (Only if caseId not provided) */}
                        {!caseId && (
                            <div className="space-y-4 p-4 border rounded-lg bg-slate-50">
                                <h3 className="font-medium text-blue-900 flex items-center gap-2">
                                    <Filter className="h-4 w-4" />
                                    Target Context
                                </h3>

                                {/* Client Selector */}
                                <div className="space-y-2">
                                    <Label>Client <span className="text-red-500">*</span></Label>
                                    <Select
                                        value={selectedClientId}
                                        onValueChange={(val) => {
                                            setSelectedClientId(val)
                                            setSelectedCaseId('') // Reset case when client changes
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a client..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {clients.map((client: any) => (
                                                <SelectItem key={client.clientId} value={client.clientId}>
                                                    {client.clientType === 'individual' ? client.fullName : client.companyName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Case Selector */}
                                <div className="space-y-2">
                                    <Label>Case <span className="text-red-500">*</span></Label>
                                    <Select
                                        value={selectedCaseId}
                                        onValueChange={setSelectedCaseId}
                                        disabled={!selectedClientId}
                                    >
                                        <SelectTrigger className={!selectedCaseId && selectedClientId ? "border-amber-400 bg-amber-50" : ""}>
                                            <SelectValue placeholder={selectedClientId ? "Select a case..." : "Select client first"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {filteredCases.map((c: any) => (
                                                <SelectItem key={c.caseId} value={c.caseId}>
                                                    {c.caseName} ({c.caseNumber || 'No Number'})
                                                </SelectItem>
                                            ))}
                                            {selectedClientId && filteredCases.length === 0 && (
                                                <SelectItem value="no-cases" disabled>No active cases found for this client</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {!selectedCaseId && selectedClientId && (
                                        <p className="text-xs text-amber-600 font-medium animate-pulse">
                                            Please select a case to proceed.
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* 1. Metadata Fields */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Document Type <span className="text-red-500">*</span></Label>
                                {(() => {
                                    // 1. Find Current Case
                                    const currentCase = cases.find((c: any) => c.caseId === (selectedCaseId || caseId));
                                    // 2. Get Allowed Doc Types
                                    let validDocTypes = masterData?.document_types || [];

                                    if (currentCase?.caseTypeId && masterData) {
                                        const ct = masterData.case_types.find(ct => ct.id === currentCase.caseTypeId);
                                        if (ct && ct.allowed_doc_types && ct.allowed_doc_types.length > 0) {
                                            validDocTypes = validDocTypes.filter(dt =>
                                                ct.allowed_doc_types.includes(dt.id) || dt.id === 'DT_034' // Always include 'Other'
                                            );
                                        }
                                    }

                                    // 3. Group by Category
                                    const grouped = validDocTypes.reduce((acc, dt) => {
                                        const cat = masterData?.document_categories.find(c => c.id === dt.category_id);
                                        const catName = cat?.name || 'Other';
                                        if (!acc[catName]) acc[catName] = [];
                                        acc[catName].push(dt);
                                        return acc;
                                    }, {} as Record<string, typeof validDocTypes>);

                                    return (
                                        <Select
                                            value={documentTypeId}
                                            onValueChange={(val) => {
                                                setDocumentTypeId(val);
                                                if (val === 'other') {
                                                    setType('other');
                                                } else {
                                                    // Auto-set generic type
                                                    const dt = masterData?.document_types.find(d => d.id === val);
                                                    if (dt && masterData) {
                                                        setType(getGenericTypeFromCategory(dt.category_id, masterData.document_categories));
                                                    }
                                                }
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select specific document type" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-[300px]">
                                                {Object.entries(grouped).map(([category, types]) => (
                                                    <div key={category}>
                                                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-slate-50 sticky top-0">
                                                            {category}
                                                        </div>
                                                        {types.map(dt => (
                                                            <SelectItem key={dt.id} value={dt.id}>
                                                                {dt.name}
                                                            </SelectItem>
                                                        ))}
                                                    </div>
                                                ))}

                                            </SelectContent>
                                        </Select>
                                    );
                                })()}
                            </div>

                            <div className="space-y-2">
                                <Label>Document Title <span className="text-red-500">*</span></Label>
                                <Input
                                    placeholder="e.g. Motion to Dismiss"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    If adding multiple files, numbers will be appended (e.g. "Title (1)", "Title (2)")
                                </p>
                            </div>


                            {/* 3. AI Toggle (Moved Up) */}
                            <div className="flex items-center space-x-2 bg-purple-50 p-3 rounded-md border border-purple-100">
                                <Checkbox
                                    id="ai-gen"
                                    checked={aiGenerate}
                                    onCheckedChange={(c) => setAiGenerate(c as boolean)}
                                />
                                <Label htmlFor="ai-gen" className="font-medium flex items-center gap-2 cursor-pointer text-purple-900 text-sm">
                                    <Sparkles className="h-3 w-3 text-purple-600" />
                                    Auto-generate Summary
                                </Label>
                            </div>

                            {!aiGenerate && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                    <Label>Summary (Optional)</Label>
                                    <Textarea
                                        placeholder="Brief description..."
                                        className="h-20 resize-none"
                                        value={summary}
                                        onChange={(e) => setSummary(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>

                        {/* 2. File Dropzone */}
                        <div className="space-y-2">
                            <Label>File Attachments ({selectedFiles.length}) <span className="text-red-500">*</span></Label>

                            <div
                                className={cn(
                                    "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
                                    dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:bg-slate-50"
                                )}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => inputRef.current?.click()}
                            >
                                <input
                                    ref={inputRef}
                                    type="file"
                                    multiple
                                    className="hidden"
                                    onChange={handleFileSelect}
                                    accept=".pdf,.doc,.docx,.txt"
                                />
                                <div className="flex flex-col items-center gap-2">
                                    <div className="p-2 bg-slate-100 rounded-full">
                                        <Upload className="h-5 w-5 text-slate-600" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-600">
                                        Click to select or drag files
                                    </p>
                                </div>
                            </div>

                            {/* Selected Files List (Mini) */}
                            {selectedFiles.length > 0 && (
                                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                    {selectedFiles.map((file, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-2 border rounded-lg bg-slate-50 text-sm">
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <FileText className="h-4 w-4 text-blue-500 shrink-0" />
                                                <span className="truncate">{file.name}</span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={() => removeSelectedFile(idx)}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>


                        <Button
                            className="w-full"
                            onClick={addToQueue}
                            disabled={selectedFiles.length === 0 || !title || !selectedCaseId}
                        >
                            Add {selectedFiles.length} Documents to Queue
                        </Button>

                    </CardContent>
                </Card>
            </div>

            {/* Right Column: The Queue */}
            <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-900">Upload Queue</h2>
                    <span className="text-sm text-slate-500">{queue.length} documents ready</span>
                </div>

                {queue.length === 0 ? (
                    <div className="border-2 border-dashed rounded-xl p-12 text-center text-slate-400 bg-slate-50/50">
                        <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <Upload className="h-6 w-6 text-slate-300" />
                        </div>
                        <p>No documents added yet.</p>
                        <p className="text-sm mt-1">Use the form on the left to add documents.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {queue.map((item) => (
                            <Card key={item.id} className="group hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-4">
                                        <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                                            <FileText className="h-5 w-5 text-blue-600" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h4 className="font-semibold text-slate-900 truncate">{item.title}</h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-800 capitalize">
                                                            {item.type}
                                                        </span>
                                                        <span className="text-xs text-slate-500">
                                                            {item.file.name} ({(item.file.size / 1024 / 1024).toFixed(2)} MB)
                                                        </span>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-slate-400 hover:text-red-600"
                                                    onClick={() => removeFromQueue(item.id)}
                                                    disabled={isUploading}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            {item.aiGenerate && (
                                                <div className="mt-2 flex items-center gap-1.5 text-xs text-purple-700">
                                                    <Sparkles className="h-3 w-3" />
                                                    <span>AI Analysis enabled</span>
                                                </div>
                                            )}

                                            {item.progress > 0 && (
                                                <div className="mt-3 space-y-1">
                                                    <div className="flex justify-between text-xs text-muted-foreground">
                                                        <span>Uploading...</span>
                                                        <span>{item.progress}%</span>
                                                    </div>
                                                    <Progress value={item.progress} className="h-1.5" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        <div className="flex justify-end pt-4 border-t">
                            <Button
                                size="lg"
                                className="w-full sm:w-auto"
                                onClick={handleUploadAll}
                                disabled={isUploading || queue.length === 0}
                            >
                                {isUploading ? 'Uploading...' : `Upload ${queue.length} Documents`}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div >
    )
}
