'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Edit, FileText, Calendar, Users, DollarSign, ArrowRight, Plus } from 'lucide-react'
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

export default function CaseDetailPage({ params }: { params: { id: string } }) {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [showUploadPrompt, setShowUploadPrompt] = useState(false)

    // Notes State
    const [newNote, setNewNote] = useState('')
    const [notes, setNotes] = useState([
        { id: 1, author: 'John Doe', date: '2 days ago', content: 'Met with client to discuss settlement options. They are open to mediation if the initial offer is above $300k.' },
        { id: 2, author: 'John Doe', date: '3 days ago', content: 'Reviewed the latest discovery documents. Found some inconsistencies in the defendant\'s timeline.' }
    ])

    const handleAddNote = () => {
        if (!newNote.trim()) return

        const note = {
            id: Date.now(),
            author: 'John Doe', // Mock current user
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
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-slate-900">Smith v. Jones</h1>
                        <Badge variant="default">Active</Badge>
                        <Badge variant="outline">Civil Litigation</Badge>
                    </div>
                    <p className="mt-2 text-slate-600">Case #CV-2024-001 • Client: John Smith</p>
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
                            <p className="text-slate-700 leading-relaxed">
                                Breach of contract dispute regarding construction delays. Client alleges defendant failed to complete work by agreed deadline of June 2024, resulting in lost revenue. Defendant claims force majeure due to supply chain issues.
                            </p>

                            <div className="mt-6 grid gap-6 md:grid-cols-2">
                                <div className="rounded-lg bg-slate-50 p-4">
                                    <h4 className="font-semibold mb-2">Client Position</h4>
                                    <p className="text-sm text-slate-600">Seeking $500k in damages plus legal fees.</p>
                                </div>
                                <div className="rounded-lg bg-slate-50 p-4">
                                    <h4 className="font-semibold mb-2">Opposing Position</h4>
                                    <p className="text-sm text-slate-600">Denies liability, claims excusable delay.</p>
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
                                <div className="text-2xl font-bold text-red-600">5 Days</div>
                                <p className="text-xs text-muted-foreground">Discovery Cutoff - Jan 22</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Parties</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">3</div>
                                <p className="text-xs text-muted-foreground">Plaintiff, Defendant, Co-Defendant</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Est. Value</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">$500,000</div>
                                <p className="text-xs text-muted-foreground">Damages Claimed</p>
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
                        <CaseDocumentView caseId={params.id} caseName="" readOnly />
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
