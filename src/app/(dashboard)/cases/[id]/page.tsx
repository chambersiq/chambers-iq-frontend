'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Edit, FileText, Calendar, Users, DollarSign, ArrowRight, Plus, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { CaseDocumentView } from '@/components/documents/CaseDocumentView'
import { Textarea } from '@/components/ui/textarea'
import { DraftList } from '@/components/drafts/DraftList'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useAuth } from '@/hooks/useAuth'
import { useCase } from '@/hooks/api/useCases'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useMasterData } from '@/contexts/MasterDataContext'

export default function CaseDetailPage({ params }: { params: { id: string } }) {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { user } = useAuth()
    const companyId = user?.companyId || ''
    const [showUploadPrompt, setShowUploadPrompt] = useState(false)
    const { data: masterData } = useMasterData()

    const { data: caseData, isLoading } = useCase(companyId, params.id)

    // Notes State (Mock for now as backend only has single string field)
    const [newNote, setNewNote] = useState('')
    const [notes, setNotes] = useState([
        { id: 1, author: 'System', date: 'Just now', content: 'Case created.' }
    ])

    const handleAddNote = () => {
        if (!newNote.trim()) return

        const note = {
            id: Date.now(),
            author: user?.fullName || 'User',
            date: 'Just now',
            content: newNote
        }

        setNotes([note, ...notes])
        setNewNote('')
    }

    useEffect(() => {
        if (searchParams.get('action') === 'created') {
            setShowUploadPrompt(true)
        }
    }, [searchParams])

    if (isLoading) {
        return <div className="p-8">Loading case details...</div>
    }

    if (!caseData) {
        return <div className="p-8">Case not found</div>
    }

    const partyCount = 1 + (caseData.opposingPartyName ? 1 : 0) + (caseData.additionalParties?.length || 0)

    return (
        <div className="space-y-4">
            {/* Upload Prompt Dialog */}
            <AlertDialog open={showUploadPrompt} onOpenChange={setShowUploadPrompt}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Case Created Successfully</AlertDialogTitle>
                        <AlertDialogDescription>
                            Would you like to upload related documents for this case now?
                            You can add titles, descriptions, and use AI to extract key information.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => router.replace(`/cases/${params.id}`)}>
                            No, later
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={() => router.push(`/cases/${params.id}/documents/new`)}>
                            Yes, Upload Documents
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                    <Link href="/cases">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-slate-900">{caseData.caseName}</h1>
                            <Badge variant={caseData.status === 'active' ? 'default' : 'secondary'} className="capitalize h-5 px-2 text-[10px]">
                                {caseData.status}
                            </Badge>
                            <Badge variant="outline" className="capitalize h-5 px-2 text-[10px]">
                                {masterData?.case_types.find(t => t.id === caseData.caseTypeId)?.name || caseData.caseSubType || 'General'}
                            </Badge>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">System Case : {caseData.caseNumber} • Client: {caseData.clientName}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href={`/cases/${params.id}/edit`}>
                        <Button variant="outline" size="sm" className="h-8">
                            <Edit className="mr-2 h-3.5 w-3.5" /> Edit Case
                        </Button>
                    </Link>
                    <Link href={`/cases/${params.id}/documents/new`}>
                        <Button size="sm" className="h-8">
                            <FileText className="mr-2 h-3.5 w-3.5" /> New Document
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="h-9">
                    <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
                    <TabsTrigger value="documents" className="text-xs">Documents</TabsTrigger>
                    <TabsTrigger value="drafts" className="text-xs">Drafts</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    {/* Summary Card */}
                    <Card>
                        <CardHeader className="py-3 px-4">
                            <CardTitle className="text-base">Case Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-4">
                            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line mb-4">
                                {caseData.caseSummary || 'No summary provided.'}
                            </p>

                            {/* Detailed Strategy Sections */}
                            <div className="space-y-4 pt-4 border-t">
                                {(caseData.keyFacts && caseData.keyFacts.length > 0) && (
                                    <div>
                                        <h4 className="font-semibold text-sm mb-1">Key Facts</h4>
                                        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-0.5">
                                            {caseData.keyFacts.map((fact, i) => <li key={i}>{fact}</li>)}
                                        </ul>
                                    </div>
                                )}

                                <div className="grid gap-4 md:grid-cols-2">
                                    {(caseData.legalIssues) && (
                                        <div>
                                            <h4 className="font-semibold text-sm mb-1">Legal Issues</h4>
                                            <p className="text-sm text-slate-600 whitespace-pre-line">{caseData.legalIssues}</p>
                                        </div>
                                    )}
                                    {(caseData.prayer) && (
                                        <div>
                                            <h4 className="font-semibold text-sm mb-1">Prayer / Relief Sought</h4>
                                            <p className="text-sm text-slate-600 whitespace-pre-line">{caseData.prayer}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 grid gap-4 md:grid-cols-2 bg-slate-50 p-3 rounded-lg">
                                <div>
                                    <h4 className="font-semibold text-sm mb-1">Client Position</h4>
                                    <p className="text-sm text-slate-600">{caseData.clientPosition || 'Not specified'}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm mb-1">Opposing Position</h4>
                                    <p className="text-sm text-slate-600">{caseData.opposingPartyPosition || 'Not specified'}</p>
                                </div>
                            </div>

                            {/* Court Information */}
                            <div className="mt-4 pt-4 border-t grid gap-4 md:grid-cols-3 text-sm">
                                <div>
                                    <span className="font-semibold text-slate-900 block text-xs uppercase tracking-wide">Court Name</span>
                                    <span className="text-slate-600">{caseData.courtName || '-'}</span>
                                </div>
                                <div>
                                    <span className="font-semibold text-slate-900 block text-xs uppercase tracking-wide">Judge</span>
                                    <span className="text-slate-600">{caseData.judgeName || '-'}</span>
                                </div>
                                <div>
                                    <span className="font-semibold text-slate-900 block text-xs uppercase tracking-wide">Case number</span>
                                    <span className="text-slate-600">{caseData.docketNumber || '-'}</span>
                                </div>
                                <div>
                                    <span className="font-semibold text-slate-900 block text-xs uppercase tracking-wide">Department</span>
                                    <span className="text-slate-600">{caseData.department || '-'}</span>
                                </div>
                                <div>
                                    <span className="font-semibold text-slate-900 block text-xs uppercase tracking-wide">Venue</span>
                                    <span className="text-slate-600">{caseData.venue || '-'}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Info Grid */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3 px-4">
                                <CardTitle className="text-sm font-medium">Next Deadline</CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent className="px-4 pb-3">
                                <div className="text-xl font-bold text-red-600">
                                    {caseData.nextHearingDate ? formatDate(caseData.nextHearingDate) : 'None'}
                                </div>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Next Hearing</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3 px-4">
                                <CardTitle className="text-sm font-medium">Parties</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent className="px-4 pb-3">
                                <div className="text-xl font-bold">{partyCount}</div>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Total Parties</p>

                                {caseData.opposingPartyName && (
                                    <div className="text-xs border-t pt-2 mt-2">
                                        <div className="font-medium truncate">vs. {caseData.opposingPartyName}</div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3 px-4">
                                <CardTitle className="text-sm font-medium">Est. Value</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent className="px-4 pb-3">
                                <div className="text-xl font-bold">
                                    {caseData.estimatedCaseValue ? formatCurrency(caseData.estimatedCaseValue) : '$0'}
                                </div>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Estimated Value</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Case Notes Section */}
                    <Card>
                        <CardHeader className="py-3 px-4">
                            <CardTitle className="text-base">Case Notes</CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-4 space-y-4">
                            <div className="space-y-2">
                                <Textarea
                                    placeholder="Add a new note..."
                                    className="min-h-[80px] text-sm"
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                />
                                <div className="flex justify-end">
                                    <Button onClick={handleAddNote} disabled={!newNote.trim()} size="sm" className="h-8">
                                        Add Note
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-3 pt-3 border-t">
                                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Previous Notes</h4>
                                <div className="space-y-3">
                                    {notes.map((note) => (
                                        <div key={note.id} className="bg-slate-50 p-3 rounded-lg border">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-medium text-sm text-slate-900">{note.author}</span>
                                                <span className="text-[10px] text-slate-500">{note.date}</span>
                                            </div>
                                            <p className="text-sm text-slate-600 whitespace-pre-line">
                                                {note.content}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border">
                        <div>
                            <h3 className="font-semibold text-slate-900 text-sm">Case Documents</h3>
                            <p className="text-xs text-slate-500">View recent files and summaries</p>
                        </div>
                        <Link href={`/documents/cases/${params.id}`}>
                            <Button variant="outline" size="sm" className="h-8 gap-2">
                                Manage Documents <ArrowRight className="h-3.5 w-3.5" />
                            </Button>
                        </Link>
                    </div>

                    <div className="border rounded-xl p-4 bg-white">
                        <CaseDocumentView caseId={params.id} caseName={caseData.caseName} readOnly />
                    </div>
                </TabsContent>

                <TabsContent value="drafts" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-medium">Legal Drafts</h3>
                            <p className="text-xs text-slate-500">AI-generated drafts for this case</p>
                        </div>
                        <Link href="/drafts/new">
                            <Button size="sm" className="h-8">
                                <Plus className="mr-2 h-3.5 w-3.5" /> New Draft
                            </Button>
                        </Link>
                    </div>
                    <DraftList caseId={params.id} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
