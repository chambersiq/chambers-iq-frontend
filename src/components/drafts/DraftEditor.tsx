'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { AIChatPanel } from './AIChatPanel'
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, Save, ArrowLeft, FileText, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'


import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import UnderlineExtension from '@tiptap/extension-underline'
import { TextAlign } from '@tiptap/extension-text-align'

import { useUpdateDraft, useDraft } from '@/hooks/api/useDrafts'
import { useParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

export function DraftEditor() {
    const params = useParams()
    const { user } = useAuth()
    const companyId = user?.companyId || ''
    const draftId = params.id as string

    // Fetch existing draft
    const { data: draft, isLoading } = useDraft(companyId, draftId)
    const updateDraft = useUpdateDraft(companyId)


    // Initial content
    const [content, setContent] = useState('')
    const [name, setName] = useState('')

    const editor = useEditor({
        extensions: [
            StarterKit,
            UnderlineExtension,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: content,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'w-full h-full min-h-[1056px] focus:outline-none focus-visible:ring-0 p-8 text-base leading-relaxed font-serif prose max-w-none print:p-0 print:border-none print:shadow-none',
            },
        },
        onUpdate: ({ editor }) => {
            setContent(editor.getHTML())
        },
    })

    // Sync draft content once loaded
    useEffect(() => {
        if (!draft) return

        console.log('Draft loaded from API:', draft)

        // Sync Name (only on first load or if empty)
        if (draft.name && (name === '' || name === 'Untitled Draft')) {
            setName(draft.name)
        }

        // Sync Content
        if (editor && draft.content) {
            // Check if editor content matches draft content to avoid loops
            // But also we need to ensure we populate it on first load
            const currentContent = editor.getHTML()
            // Tiptap might add wrapper tags, so exact match is tricky. 
            // Better to rely on a "initialized" flag or something, but checking equality is a good first step.
            // We'll trust the draft data if the editor is essentially empty or if we assume this is the first load.

            // Simplest check: if current content is default empty P tag and draft has content
            const isEmpty = currentContent === '<p></p>' || currentContent === ''

            if (isEmpty || currentContent !== draft.content) {
                // Only force update if we think we are initializing
                // Using a simple check to see if we have set it before might be better.
                if (content === '') { // Use 'content' state as proxy for "have we loaded initial data?"
                    console.log('Setting editor content from draft')
                    editor.commands.setContent(draft.content)
                    setContent(draft.content)
                }
            }
        }
    }, [draft, editor]) // content dependency removed to avoid loop? No, content state is updated by editor update.

    const handleSave = async () => {
        if (!editor) return
        try {
            await updateDraft.mutateAsync({
                draftId,
                data: {
                    content: editor.getHTML(),
                    name: name
                }
            })
            toast.success('Draft saved successfully')
        } catch (error) {
            console.error('Failed to save draft', error)
            toast.error('Failed to save draft')
        }
    }

    const handleExport = () => {
        window.print()
    }

    if (isLoading && !editor) return <div className="p-8">Loading editor...</div>

    if (!editor) {
        return null
    }

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col print:h-auto print:block">
            {/* Header */}
            <div className="h-14 border-b bg-white flex items-center justify-between px-4 shrink-0 print:hidden">
                <div className="flex items-center gap-4">
                    <Link href="/drafts">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="font-semibold text-sm bg-transparent border-none focus:outline-none focus:ring-0 p-0 m-0 w-[300px]"
                            placeholder="Untitled Draft"
                        />
                        <p className="text-xs text-muted-foreground">
                            {draft?.lastEditedAt ? `Last saved at ${new Date(draft.lastEditedAt).toLocaleTimeString()}` : 'Unsaved'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleExport}>
                        <FileText className="mr-2 h-4 w-4" /> Export PDF
                    </Button>
                    <Button size="sm" onClick={handleSave} disabled={updateDraft.isPending}>
                        {updateDraft.isPending ? <span className="animate-spin mr-2">⏳</span> : <Save className="mr-2 h-4 w-4" />}
                        Save
                    </Button>
                </div>
            </div>

            {/* Main Workspace */}
            <div className="flex-1 flex overflow-hidden print:overflow-visible print:h-auto">
                {/* Editor Column */}
                <div className="flex-1 flex flex-col min-w-0 bg-slate-100 print:bg-white print:block">
                    {/* Toolbar */}
                    <div className="flex items-center gap-1 p-2 border-b bg-white shrink-0 print:hidden">
                        <Button
                            variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => editor.chain().focus().toggleBold().run()}
                        >
                            <Bold className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                        >
                            <Italic className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={editor.isActive('underline') ? 'secondary' : 'ghost'}
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                        >
                            <Underline className="h-4 w-4" />
                        </Button>
                        <div className="w-px h-6 bg-border mx-2" />
                        <Button variant="ghost" size="icon" className="h-8 w-8"><AlignLeft className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><AlignCenter className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><AlignRight className="h-4 w-4" /></Button>
                    </div>

                    {/* Document Page */}
                    <div className="flex-1 overflow-y-auto p-8 flex justify-center print:p-0 print:overflow-visible print:block" onClick={() => editor.chain().focus().run()}>
                        <div className="bg-white shadow-sm border w-full max-w-[816px] min-h-[1056px] print:shadow-none print:border-none print:w-full print:max-w-none print:min-h-0">
                            <EditorContent editor={editor} />
                        </div>
                    </div>
                </div>

                {/* Right Sidebar (AI & Context) */}
                <div className="w-[400px] border-l bg-white flex flex-col shrink-0 print:hidden">
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
                                        {draft?.caseName || 'Case details not available'}
                                        {/* Ideally we fetch detailed case info here */}
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
                                            <span className="font-semibold">Petitioner:</span> John Smith
                                        </div>
                                        <div>
                                            <span className="font-semibold">Respondent:</span> Acme Corp
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
