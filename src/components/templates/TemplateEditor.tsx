'use client'

import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List } from 'lucide-react'

interface TemplateEditorProps {
    value?: string
    onChange?: (value: string) => void
}

export function TemplateEditor({ value = '', onChange }: TemplateEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const handleFormat = (format: 'bold' | 'italic' | 'underline' | 'list') => {
        if (!textareaRef.current) return

        const start = textareaRef.current.selectionStart
        const end = textareaRef.current.selectionEnd
        const text = value

        let prefix = ''
        let suffix = ''

        switch (format) {
            case 'bold':
                prefix = '**'
                suffix = '**'
                break
            case 'italic':
                prefix = '*'
                suffix = '*'
                break
            case 'underline':
                prefix = '__'
                suffix = '__'
                break
            case 'list':
                prefix = '\n- '
                suffix = ''
                break
        }

        const newText = text.substring(0, start) + prefix + text.substring(start, end) + suffix + text.substring(end)

        onChange?.(newText)

        // Restore focus and selection
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus()
                textareaRef.current.setSelectionRange(
                    start + prefix.length,
                    end + prefix.length
                )
            }
        }, 0)
    }

    return (
        <div className="flex flex-col h-full border rounded-md shadow-sm bg-white overflow-hidden focus-within:ring-1 focus-within:ring-ring">
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 border-b bg-slate-50">
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-200" onClick={() => handleFormat('bold')}>
                    <Bold className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-200" onClick={() => handleFormat('italic')}>
                    <Italic className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-200" onClick={() => handleFormat('underline')}>
                    <Underline className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-border mx-2" />
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-200" disabled title="Not supported in plain text">
                    <AlignLeft className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-200" disabled title="Not supported in plain text">
                    <AlignCenter className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-200" disabled title="Not supported in plain text">
                    <AlignRight className="h-4 w-4 text-muted-foreground" />
                </Button>
                <div className="w-px h-6 bg-border mx-2" />
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-200" onClick={() => handleFormat('list')}>
                    <List className="h-4 w-4" />
                </Button>
            </div>

            {/* Text Area */}
            <Textarea
                ref={textareaRef}
                className="flex-1 font-mono text-sm resize-none p-6 leading-relaxed border-0 focus-visible:ring-0 rounded-none overflow-y-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 hover:[&::-webkit-scrollbar-thumb]:bg-slate-300"
                placeholder="Start typing your template here..."
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
            />
        </div>
    )
}

