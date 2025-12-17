'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, Code } from 'lucide-react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import UnderlineExtension from '@tiptap/extension-underline'
import { TextAlign } from '@tiptap/extension-text-align'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

interface TemplateEditorProps {
    value?: string
    onChange?: (value: string) => void
}

export function TemplateEditor({ value = '', onChange }: TemplateEditorProps) {
    const [htmlImport, setHtmlImport] = useState('')
    const [showImportDialog, setShowImportDialog] = useState(false)

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                // Allow all heading levels
                heading: {
                    levels: [1, 2, 3, 4, 5, 6],
                },
            }),
            BulletList,
            OrderedList,
            ListItem,
            UnderlineExtension,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: value,
        immediatelyRender: false,
        parseOptions: {
            preserveWhitespace: false,
        },
        editorProps: {
            attributes: {
                class: 'w-full focus:outline-none focus-visible:ring-0 p-6 text-base leading-relaxed font-serif prose prose-slate max-w-none w-full break-words whitespace-normal [&_hr]:border-t [&_hr]:border-gray-300 [&_hr]:my-4 [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_li]:mb-1',
            },
            handlePaste: (view, event, slice) => {
                // Allow HTML paste to be parsed correctly
                const html = event.clipboardData?.getData('text/html')
                if (html && editor) {
                    // Convert uppercase HTML tags to lowercase
                    const normalizedHtml = html.replace(/<\/?([A-Z][A-Z0-9]*)\b[^>]*>/gi, (match, tagName) => {
                        return match.replace(tagName, tagName.toLowerCase())
                    })
                    // Insert the normalized HTML
                    editor.commands.insertContent(normalizedHtml)
                    return true
                }
                return false
            },
        },
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML())
        },
    })

    // Sync external value changes
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            // Set content - TipTap will automatically parse HTML
            editor.commands.setContent(value)
        }
    }, [value, editor])

    if (!editor) {
        return <div className="p-8">Loading editor...</div>
    }

    return (
        <div className="flex flex-col h-full border rounded-md shadow-sm bg-white overflow-hidden focus-within:ring-1 focus-within:ring-ring">
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 border-b bg-slate-50">
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
                <Button
                    variant={editor.isActive({ textAlign: 'left' }) ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                >
                    <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant={editor.isActive({ textAlign: 'center' }) ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                >
                    <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                    variant={editor.isActive({ textAlign: 'right' }) ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                >
                    <AlignRight className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-border mx-2" />
                <Button
                    variant={editor.isActive('bulletList') ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                        console.log('Bullet list button clicked');
                        console.log('Editor commands:', Object.keys(editor.commands));
                        console.log('Can toggleBulletList:', editor.can().toggleBulletList());
                        console.log('Is active bulletList:', editor.isActive('bulletList'));

                        if (editor.can().toggleBulletList()) {
                            editor.chain().focus().toggleBulletList().run();
                        } else {
                            console.log('Cannot toggle bullet list, trying alternative...');
                            // Try alternative: wrap in bullet list
                            editor.chain().focus().wrapInList('bulletList').run();
                        }
                    }}
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    variant={editor.isActive('orderedList') ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                        console.log('Ordered list button clicked');
                        console.log('Can toggleOrderedList:', editor.can().toggleOrderedList());
                        console.log('Is active orderedList:', editor.isActive('orderedList'));

                        if (editor.can().toggleOrderedList()) {
                            editor.chain().focus().toggleOrderedList().run();
                        } else {
                            console.log('Cannot toggle ordered list, trying alternative...');
                            // Try alternative: wrap in ordered list
                            editor.chain().focus().wrapInList('orderedList').run();
                        }
                    }}
                    title="Numbered List"
                >
                    <span className="text-xs font-bold">1.</span>
                </Button>
                <div className="w-px h-6 bg-border mx-2" />
                <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Code className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Import HTML Content</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <Textarea
                                placeholder="Paste your HTML content here..."
                                value={htmlImport}
                                onChange={(e) => setHtmlImport(e.target.value)}
                                className="min-h-[300px] font-mono text-sm"
                            />
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setShowImportDialog(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => {
                                        if (htmlImport.trim()) {
                                            editor.commands.setContent(htmlImport.trim())
                                            setHtmlImport('')
                                            setShowImportDialog(false)
                                        }
                                    }}
                                >
                                    Import HTML
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Editor Content */}
            <div className="flex-1 overflow-y-auto">
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}
