'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MultiAgentWorkflowManager } from './MultiAgentWorkflowManager'
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, Save, ArrowLeft, FileText, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'


import { useQueryClient } from '@tanstack/react-query'
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
    const [forceUpdate, setForceUpdate] = useState(false)
    const queryClient = useQueryClient()

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

    // Sync draft content once loaded or Forced
    useEffect(() => {
        if (!draft) return

        console.log('Draft loaded from API:', draft)

        // Sync Name (only on first load or if empty)
        if (draft.name && (name === '' || name === 'Untitled Draft')) {
            setName(draft.name)
        }

        // Sync Content
        if (editor && draft.content) {
            const currentContent = editor.getHTML()
            const isEmpty = currentContent === '<p></p>' || currentContent === ''

            // Update if:
            // 1. Editor is empty (Initial load)
            // 2. forceUpdate is true (Workflow completed)
            if (isEmpty || forceUpdate) {
                // Check if content actually changed to avoid unnecessary re-renders or loops if logic is flawed
                if (currentContent !== draft.content) {
                    console.log('Setting editor content from draft (Force/Init)')
                    editor.commands.setContent(draft.content)
                    setContent(draft.content)
                    setForceUpdate(false) // Reset flag
                }
            }
        }
    }, [draft, editor, forceUpdate])

    const handleWorkflowComplete = () => {
        console.log('Workflow complete, refreshing draft...')
        queryClient.invalidateQueries({ queryKey: ['draft', companyId, draftId] })
        setForceUpdate(true)
        toast.success('Draft updated with agent content')
    }

    const handleWorkflowProgress = (partialContent: string) => {
        if (editor) {
            // Only update if content length is different significantly to avoid jitter
            // Or just update. Tiptap handles HTML string diffing reasonably well usually.
            // But we check strictly to avoid loops if needed.
            const current = editor.getHTML()
            if (current !== partialContent) {
                editor.commands.setContent(partialContent)
            }
        }
    }

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
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="font-bold text-lg bg-transparent border-none focus:outline-none focus:ring-0 p-0 m-0 w-auto min-w-[150px] max-w-[300px]"
                            placeholder="Untitled Draft"
                        />

                        {/* Context Info - Inline & Bigger */}
                        <div className="flex items-center gap-3 text-sm text-slate-500 h-8 pt-1">
                            <span className="text-slate-300 text-xl font-light">/</span>

                            {draft?.caseName && (
                                <span className="flex items-center gap-1.5 font-medium text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer">
                                    <BookOpen className="h-4 w-4 text-slate-400" />
                                    {draft.caseName}
                                </span>
                            )}

                            {draft?.clientName && (
                                <>
                                    <span className="text-slate-300">•</span>
                                    <span className="text-slate-600">Client: <span className="font-medium text-slate-800">{draft.clientName}</span></span>
                                </>
                            )}

                            {draft?.templateName && (
                                <>
                                    <span className="text-slate-300">•</span>
                                    <span className="text-slate-600">Template: <span className="font-medium text-slate-800">{draft.templateName}</span></span>
                                </>
                            )}

                            {draft?.documentType && draft.documentType !== "General" && (
                                <>
                                    <span className="text-slate-300">•</span>
                                    <span className="text-slate-600">Type: <span className="font-medium text-slate-800">{draft.documentType}</span></span>
                                </>
                            )}

                            <span className="text-slate-300">•</span>
                            <span className="text-slate-500 text-xs">
                                {draft?.lastEditedAt ? `Saved ${new Date(draft.lastEditedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Unsaved'}
                            </span>
                        </div>
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
                    <div className="flex-1 overflow-y-auto p-4 flex justify-center print:p-0 print:overflow-visible print:block" onClick={() => editor.chain().focus().run()}>
                        <div className="bg-white shadow-sm border w-full max-w-5xl min-h-[1056px] print:shadow-none print:border-none print:w-full print:max-w-none print:min-h-0">
                            <EditorContent editor={editor} />
                        </div>
                    </div>
                </div>

                {/* Right Sidebar (Agents Only) */}
                <div className="w-[400px] border-l bg-white flex flex-col shrink-0 print:hidden">
                    <MultiAgentWorkflowManager
                        caseId={draft?.caseId || 'demo-case'}
                        caseType={draft?.caseType || 'General'}
                        clientId={draft?.clientId || 'demo-client'}
                        onWorkflowComplete={handleWorkflowComplete}
                        onWorkflowProgress={handleWorkflowProgress}
                    />
                </div>
            </div>
        </div>
    )
}
