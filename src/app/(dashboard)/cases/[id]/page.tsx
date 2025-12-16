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
        <div className="space-y-6">
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
                <div className="flex items-start gap-4">
                    <Link href="/cases">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-slate-900">{caseData.caseName}</h1>
                            <Badge variant={caseData.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                                {caseData.status}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                                {masterData?.case_types.find(t => t.id === caseData.caseTypeId)?.name || caseData.caseSubType || 'General'}
                            </Badge>
                        </div>
                        <p className="mt-2 text-slate-600">Case #{caseData.caseNumber} • Client: {caseData.clientName}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link href={`/cases/${params.id}/edit`}>
                        <Button variant="outline">
                            <Edit className="mr-2 h-4 w-4" /> Edit Case
                        </Button>
                    </Link>
                    <Link href={`/cases/${params.id}/documents/new`}>
                        <Button>
                            <FileText className="mr-2 h-4 w-4" /> New Document
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="drafts">Drafts</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    {/* Summary Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Case Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-700 leading-relaxed whitespace-pre-line mb-6">
                                {caseData.caseSummary || 'No summary provided.'}
                            </p>

                            {/* Detailed Strategy Sections */}
                            <div className="space-y-6 pt-6 border-t">
                                {(caseData.keyFacts && caseData.keyFacts.length > 0) && (
                                    <div>
                                        <h4 className="font-semibold mb-2">Key Facts</h4>
                                        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                                            {caseData.keyFacts.map((fact, i) => <li key={i}>{fact}</li>)}
                                        </ul>
                                    </div>
                                )}

                                <div className="grid gap-6 md:grid-cols-2">
                                    {(caseData.legalIssues) && (
                                        <div>
                                            <h4 className="font-semibold mb-2">Legal Issues</h4>
                                            <p className="text-sm text-slate-600 whitespace-pre-line">{caseData.legalIssues}</p>
                                        </div>
                                    )}
                                    {(caseData.prayer) && (
                                        <div>
                                            <h4 className="font-semibold mb-2">Prayer / Relief Sought</h4>
                                            <p className="text-sm text-slate-600 whitespace-pre-line">{caseData.prayer}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6 grid gap-6 md:grid-cols-2 bg-slate-50 p-4 rounded-lg">
                                <div>
                                    <h4 className="font-semibold mb-2">Client Position</h4>
                                    <p className="text-sm text-slate-600">{caseData.clientPosition || 'Not specified'}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Opposing Position</h4>
                                    <p className="text-sm text-slate-600">{caseData.opposingPartyPosition || 'Not specified'}</p>
                                </div>
                            </div>

                            {/* Court Information */}
                            <div className="mt-6 pt-6 border-t grid gap-4 md:grid-cols-3 text-sm">
                                <div>
                                    <span className="font-semibold text-slate-900 block">Jurisdiction</span>
                                    <span className="text-slate-600 capitalize">{caseData.jurisdiction || '-'}</span>
                                </div>
                                <div>
                                    <span className="font-semibold text-slate-900 block">Court Name</span>
                                    <span className="text-slate-600">{caseData.courtName || '-'}</span>
                                </div>
                                <div>
                                    <span className="font-semibold text-slate-900 block">Judge</span>
                                    <span className="text-slate-600">{caseData.judgeName || '-'}</span>
                                </div>
                                <div>
                                    <span className="font-semibold text-slate-900 block">Docket #</span>
                                    <span className="text-slate-600">{caseData.docketNumber || '-'}</span>
                                </div>
                                <div>
                                    <span className="font-semibold text-slate-900 block">Department</span>
                                    <span className="text-slate-600">{caseData.department || '-'}</span>
                                </div>
                                <div>
                                    <span className="font-semibold text-slate-900 block">Venue</span>
                                    <span className="text-slate-600">{caseData.venue || '-'}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Info Grid */}
                    <div className="grid gap-6 md:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Next Deadline</CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">
                                    {caseData.nextHearingDate ? formatDate(caseData.nextHearingDate) : 'None'}
                                </div>
                                <p className="text-xs text-muted-foreground">Next Hearing</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Parties</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{partyCount}</div>
                                <p className="text-xs text-muted-foreground mb-4">Total Parties Involved</p>

                                {caseData.opposingPartyName && (
                                    <div className="text-sm border-t pt-2 mt-2">
                                        <div className="font-semibold">Opposing: {caseData.opposingPartyName}</div>
                                        {caseData.opposingCounselName && (
                                            <div className="text-xs text-slate-500 mt-1">
                                                Counsel: {caseData.opposingCounselName}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Est. Value</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {caseData.estimatedCaseValue ? formatCurrency(caseData.estimatedCaseValue) : '$0'}
                                </div>
                                <p className="text-xs text-muted-foreground">Estimated Value</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Case Notes Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Case Notes</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <Textarea
                                    placeholder="Add a new note..."
                                    className="min-h-[100px]"
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                />
                                <div className="flex justify-end">
                                    <Button onClick={handleAddNote} disabled={!newNote.trim()}>
                                        Add Note
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Previous Notes</h4>
                                <div className="space-y-4">
                                    {notes.map((note) => (
                                        <div key={note.id} className="bg-slate-50 p-4 rounded-lg border">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium text-sm text-slate-900">{note.author}</span>
                                                <span className="text-xs text-slate-500">{note.date}</span>
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

                <TabsContent value="documents" className="space-y-6">
                    <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg border">
                        <div>
                            <h3 className="font-semibold text-slate-900">Case Documents</h3>
                            <p className="text-sm text-slate-500">View recent files and summaries</p>
                        </div>
                        <Link href={`/documents/cases/${params.id}`}>
                            <Button variant="outline" className="gap-2">
                                Manage Documents <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>

                    <div className="border rounded-xl p-6 bg-white">
                        <CaseDocumentView caseId={params.id} caseName={caseData.caseName} readOnly />
                    </div>
                </TabsContent>

                <TabsContent value="drafts" className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-medium">Legal Drafts</h3>
                            <p className="text-sm text-slate-500">AI-generated drafts for this case</p>
                        </div>
                        <Link href="/drafts/new">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> New Draft
                            </Button>
                        </Link>
                    </div>
                    <DraftList caseId={params.id} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
