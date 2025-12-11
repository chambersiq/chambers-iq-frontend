'use client'

import { useState } from 'react'
import { Document, DocumentType } from '@/types/document'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Plus, Trash2, Download, Eye, Sparkles, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useDocuments, useDeleteDocument } from '@/hooks/api/useDocuments'
import { useAuth } from '@/hooks/useAuth'

// --- Helper Component for Inline Expandable Text ---
// --- Helper Component for Inline Expandable Text ---
function InlineExpandableText({ text, label, icon: Icon, className }: { text: string, label: string, icon?: any, className?: string }) {
    const [expanded, setExpanded] = useState(false)
    const limit = 100
    const shouldTruncate = text.length > limit

    let displayContent = expanded ? text : (shouldTruncate ? text.slice(0, limit) : text);

    // Fix broken markdown in truncated text
    if (!expanded && shouldTruncate) {
        if (text.startsWith('**') && !displayContent.endsWith('**')) {
            displayContent += '...**';
        } else if (text.startsWith('*') && !text.startsWith('**') && !displayContent.endsWith('*')) {
            displayContent += '...*';
        } else {
            displayContent += '...';
        }
    }

    // Simple Bold & Italic Formatter
    const formatText = (content: string) => {
        // Splitting by bold first (**...**)
        const parts = content.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
            }

            // Then split by italic (*...*) within non-bold parts
            const subParts = part.split(/(\*.*?\*)/g);
            return subParts.map((subPart, j) => {
                if (subPart.startsWith('*') && subPart.endsWith('*') && subPart.length > 2) {
                    return <em key={`${i}-${j}`} className="italic text-slate-800">{subPart.slice(1, -1)}</em>;
                }
                return subPart;
            });
        });
    };

    return (
        <div className={cn("text-sm flex items-start gap-2", className)}>
            <span className="font-semibold text-xs uppercase tracking-wider text-slate-500 shrink-0 mt-0.5 min-w-[80px]">
                {Icon && <Icon className="h-3 w-3 inline mr-1 -mt-0.5" />}
                {label}:
            </span>
            <div className="flex-1 min-w-0 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                <span>
                    {formatText(displayContent)}
                    {shouldTruncate && !expanded && (
                        <button
                            onClick={() => setExpanded(true)}
                            className="text-[10px] font-medium text-blue-600 hover:text-blue-800 ml-1.5 inline-flex items-center gap-0.5 align-baseline"
                        >
                            Show More <ChevronDown className="h-3 w-3" />
                        </button>
                    )}
                    {expanded && (
                        <button
                            onClick={() => setExpanded(false)}
                            className="text-[10px] font-medium text-blue-600 hover:text-blue-800 ml-1.5 inline-flex items-center gap-0.5 align-baseline"
                        >
                            Show Less <ChevronUp className="h-3 w-3" />
                        </button>
                    )}
                </span>
            </div>
        </div>
    )
}

// Mock Data Generator


interface CaseDocumentViewProps {
    caseId: string
    caseName: string
    readOnly?: boolean
    hideHeader?: boolean
}

export function CaseDocumentView({ caseId, caseName, readOnly = false, hideHeader = false }: CaseDocumentViewProps) {
    const { user } = useAuth()
    const companyId = user?.companyId || ''
    const { data: documents = [], isLoading } = useDocuments(companyId, caseId)

    // Group documents by type
    const groupedDocs = documents.reduce((acc, doc) => {
        if (!acc[doc.type]) acc[doc.type] = []
        acc[doc.type].push(doc)
        return acc
    }, {} as Record<DocumentType, Document[]>)

    const deleteDocument = useDeleteDocument(companyId)

    const handleDelete = (documentId: string) => {
        if (confirm("Are you sure you want to delete this document?")) {
            deleteDocument.mutate({ caseId, documentId })
        }
    }

    if (isLoading) {
        return <div className="text-sm text-slate-500">Loading documents...</div>
    }

    if (documents.length === 0) {
        return (
            <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed">
                <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900">No documents yet</h3>
                <p className="text-slate-500 mb-6">Upload documents to get started with AI analysis.</p>
                {!readOnly && (
                    <Link href={`/cases/${caseId}/documents/new`}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Upload Document
                        </Button>
                    </Link>
                )}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {!readOnly && !hideHeader && (
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-800">{caseName}</h2>
                    <Link href={`/cases/${caseId}/documents/new`}>
                        <Button size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Documents
                        </Button>
                    </Link>
                </div>
            )}

            <div className="grid gap-6">
                {Object.entries(groupedDocs).map(([type, docs]) => (
                    <Card key={type}>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-medium capitalize flex items-center gap-2">
                                {type}s
                                <Badge variant="secondary" className="ml-2">
                                    {docs.length}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {docs.map(doc => (
                                    <div
                                        key={doc.documentId}
                                        className="px-3 py-2 rounded-lg border bg-slate-50/50 hover:bg-slate-50 transition-colors group"
                                    >
                                        <div className="flex items-center gap-4">

                                            {/* Section 1: File Info (Fixed Width) */}
                                            <div className="flex items-center gap-3 w-[250px] shrink-0">
                                                <div className="h-8 w-8 bg-slate-100 rounded flex items-center justify-center shrink-0">
                                                    <FileText className="h-4 w-4 text-slate-500" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium text-sm text-slate-900 truncate" title={doc.name}>{doc.name}</p>
                                                        {doc.aiStatus === 'completed' && (
                                                            <Sparkles className="h-3 w-3 text-purple-600 shrink-0" />
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                                        <span>{(doc.fileSize / 1024 / 1024).toFixed(1)} MB</span>
                                                        <span>•</span>
                                                        <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Section 2: Unified Summary */}
                                            <div className="flex-1 min-w-0 border-l pl-4 border-slate-200 h-full">
                                                {doc.description ? (
                                                    <InlineExpandableText
                                                        label={doc.aiStatus === 'completed' ? "AI Summary" : "Summary"}
                                                        text={doc.description}
                                                        icon={doc.aiStatus === 'completed' ? Sparkles : undefined}
                                                        className={doc.aiStatus === 'completed' ? "text-purple-900" : ""}
                                                    />
                                                ) : (
                                                    <span className="text-[11px] text-slate-300 italic">No summary</span>
                                                )}
                                            </div>

                                            {/* Section 3: Actions (Fixed) */}
                                            <div className="flex items-center gap-1 shrink-0 pl-2">
                                                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => window.open(doc.url, '_blank')}>
                                                    <Eye className="h-5 w-5 text-slate-500" />
                                                </Button>
                                                <a href={doc.url} download target="_blank" rel="noopener noreferrer">
                                                    <Button variant="ghost" size="icon" className="h-9 w-9">
                                                        <Download className="h-5 w-5 text-slate-500" />
                                                    </Button>
                                                </a>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-9 w-9 hover:text-red-600"
                                                    onClick={() => handleDelete(doc.documentId)}
                                                    disabled={deleteDocument.isPending}
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </Button>
                                            </div>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
