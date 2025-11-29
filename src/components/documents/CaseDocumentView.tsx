'use client'

import { useState } from 'react'
import { Document, DocumentType } from '@/types/document'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Plus, Trash2, Download, Eye, Sparkles, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// --- Helper Component for Inline Expandable Text ---
function InlineExpandableText({ text, label, icon: Icon, className }: { text: string, label: string, icon?: any, className?: string }) {
    const [expanded, setExpanded] = useState(false)
    const limit = 50 // Character limit for inline truncation
    const shouldTruncate = text.length > limit

    return (
        <div className={cn("text-sm flex items-start gap-2", className)}>
            <span className="font-semibold text-xs uppercase tracking-wider text-slate-500 shrink-0 mt-0.5 min-w-[80px]">
                {Icon && <Icon className="h-3 w-3 inline mr-1 -mt-0.5" />}
                {label}:
            </span>
            <div className="flex-1 min-w-0 text-sm text-slate-700 leading-relaxed">
                {expanded ? (
                    <span>
                        {text}
                        <button
                            onClick={() => setExpanded(false)}
                            className="text-[10px] font-medium text-blue-600 hover:text-blue-800 ml-1.5 inline-flex items-center gap-0.5 align-baseline"
                        >
                            Show Less <ChevronUp className="h-3 w-3" />
                        </button>
                    </span>
                ) : (
                    <span>
                        {shouldTruncate ? `${text.slice(0, limit)}...` : text}
                        {shouldTruncate && (
                            <button
                                onClick={() => setExpanded(true)}
                                className="text-[10px] font-medium text-blue-600 hover:text-blue-800 ml-1.5 inline-flex items-center gap-0.5 align-baseline"
                            >
                                Show More <ChevronDown className="h-3 w-3" />
                            </button>
                        )}
                    </span>
                )}
            </div>
        </div>
    )
}

// Mock Data Generator
const generateMockDocs = (caseId: string): Document[] => {
    const types: DocumentType[] = ['pleading', 'motion', 'evidence', 'correspondence']
    return Array.from({ length: 8 }).map((_, i) => ({
        id: `doc-${caseId}-${i}`,
        caseId,
        name: `${types[i % 4].charAt(0).toUpperCase() + types[i % 4].slice(1)} ${i + 1}.pdf`,
        type: types[i % 4],
        fileSize: 1024 * 1024 * (i + 1),
        mimeType: 'application/pdf',
        url: '#',
        aiStatus: i % 3 === 0 ? 'completed' : 'pending',
        // Add mock summaries with varying lengths
        description: i % 2 === 0 ? "This document outlines the initial complaint filed by the plaintiff regarding the breach of contract. It details the specific clauses violated and the timeline of events leading up to the dispute." : undefined,
        aiSummary: i % 3 === 0 ? "Key Points:\n- Plaintiff alleges breach of Section 4.2\n- Damages estimated at $50,000\n- Filed on Jan 15, 2024\n- Request for jury trial included in the filing." : undefined,
        uploadedBy: 'John Doe',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }))
}

interface CaseDocumentViewProps {
    caseId: string
    caseName: string
    readOnly?: boolean
}

export function CaseDocumentView({ caseId, caseName, readOnly = false }: CaseDocumentViewProps) {
    const [documents, setDocuments] = useState<Document[]>(generateMockDocs(caseId))

    // Group documents by type
    const groupedDocs = documents.reduce((acc, doc) => {
        if (!acc[doc.type]) acc[doc.type] = []
        acc[doc.type].push(doc)
        return acc
    }, {} as Record<DocumentType, Document[]>)

    const handleDelete = (id: string) => {
        setDocuments(prev => prev.filter(d => d.id !== id))
    }

    return (
        <div className="space-y-6">
            {!readOnly && (
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
                                        key={doc.id}
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

                                            {/* Section 2: Summaries (Flex Fill - Side by Side) */}
                                            <div className="flex-1 min-w-0 flex items-center gap-4 border-l pl-4 border-slate-200 h-full">
                                                {/* User Summary */}
                                                <div className="flex-1 min-w-0">
                                                    {doc.description ? (
                                                        <InlineExpandableText
                                                            label="Summary"
                                                            text={doc.description}
                                                        />
                                                    ) : (
                                                        <span className="text-[11px] text-slate-300 italic">No summary</span>
                                                    )}
                                                </div>

                                                {/* AI Summary */}
                                                <div className="flex-1 min-w-0 border-l pl-4 border-slate-200">
                                                    {doc.aiSummary ? (
                                                        <InlineExpandableText
                                                            label="AI Analysis"
                                                            text={doc.aiSummary}
                                                            icon={Sparkles}
                                                            className="text-purple-900"
                                                        />
                                                    ) : (
                                                        <span className="text-[11px] text-slate-300 italic">No AI analysis</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Section 3: Actions (Fixed) */}
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 pl-2">
                                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                                    <Eye className="h-3 w-3 text-slate-500" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                                    <Download className="h-3 w-3 text-slate-500" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 hover:text-red-600"
                                                    onClick={() => handleDelete(doc.id)}
                                                >
                                                    <Trash2 className="h-3 w-3" />
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
