'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { AIChatPanel } from './AIChatPanel'
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, Save, ArrowLeft, FileText, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function DraftEditor() {
    const [content, setContent] = useState(`IN THE SUPERIOR COURT OF THE STATE OF CALIFORNIA
COUNTY OF LOS ANGELES

JOHN SMITH,
    Plaintiff,
v.
ACME CORP,
    Defendant.

CASE NO. CV-2024-001

DEFENDANT'S NOTICE OF MOTION AND MOTION TO DISMISS COMPLAINT; MEMORANDUM OF POINTS AND AUTHORITIES

TO ALL PARTIES AND THEIR ATTORNEYS OF RECORD:

PLEASE TAKE NOTICE that on [Date], at [Time], or as soon thereafter as the matter may be heard, in Department [Dept] of the above-entitled court, Defendant Acme Corp will, and hereby does, move for an order dismissing the Complaint filed by Plaintiff John Smith.

This motion is made on the grounds that the Complaint fails to state facts sufficient to constitute a cause of action against Defendant.`)

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col">
            {/* Header */}
            <div className="h-14 border-b bg-white flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/drafts">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="font-semibold text-sm">Motion to Dismiss - Smith v. Jones</h1>
                        <p className="text-xs text-muted-foreground">Last saved 2 mins ago</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" /> Export PDF
                    </Button>
                    <Button size="sm">
                        <Save className="mr-2 h-4 w-4" /> Save
                    </Button>
                </div>
            </div>

            {/* Main Workspace */}
            <div className="flex-1 flex overflow-hidden">
                {/* Editor Column */}
                <div className="flex-1 flex flex-col min-w-0 bg-slate-100">
                    {/* Toolbar */}
                    <div className="flex items-center gap-1 p-2 border-b bg-white shrink-0">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Bold className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Italic className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Underline className="h-4 w-4" /></Button>
                        <div className="w-px h-6 bg-border mx-2" />
                        <Button variant="ghost" size="icon" className="h-8 w-8"><AlignLeft className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><AlignCenter className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><AlignRight className="h-4 w-4" /></Button>
                    </div>

                    {/* Document Page */}
                    <div className="flex-1 overflow-y-auto p-8 flex justify-center">
                        <div className="bg-white shadow-sm border w-full max-w-[816px] min-h-[1056px] p-[96px]">
                            <Textarea
                                className="w-full h-full border-none resize-none focus-visible:ring-0 p-0 text-base leading-relaxed font-serif"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                spellCheck={false}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Sidebar (AI & Context) */}
                <div className="w-[400px] border-l bg-white flex flex-col shrink-0">
                    <Tabs defaultValue="chat" className="flex-1 flex flex-col">
                        <TabsList className="w-full justify-start rounded-none border-b p-0 h-10 bg-white">
                            <TabsTrigger value="chat" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none px-6">
                                AI Assistant
                            </TabsTrigger>
                            <TabsTrigger value="context" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none px-6">
                                Case Context
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="chat" className="flex-1 m-0 p-0 h-full overflow-hidden">
                            <AIChatPanel />
                        </TabsContent>

                        <TabsContent value="context" className="flex-1 m-0 p-4 overflow-y-auto bg-slate-50">
                            <div className="space-y-4">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                                            <BookOpen className="h-4 w-4" /> Case Summary
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm text-slate-600">
                                        Breach of contract dispute. Client alleges defendant failed to pay $500K. Defendant claims force majeure.
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">Key Facts</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm text-slate-600 space-y-2">
                                        <p>• Contract signed March 15, 2024</p>
                                        <p>• Work completed June 30, 2024</p>
                                        <p>• Payment due July 15, 2024</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">Parties</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm text-slate-600 space-y-2">
                                        <div>
                                            <span className="font-semibold">Plaintiff:</span> John Smith
                                        </div>
                                        <div>
                                            <span className="font-semibold">Defendant:</span> Acme Corp
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
