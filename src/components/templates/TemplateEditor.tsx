'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, Plus } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

const VARIABLES = [
    { key: 'client_name', label: 'Client Name' },
    { key: 'client_address', label: 'Client Address' },
    { key: 'case_number', label: 'Case Number' },
    { key: 'opposing_party', label: 'Opposing Party' },
    { key: 'court_name', label: 'Court Name' },
    { key: 'judge_name', label: 'Judge Name' },
    { key: 'current_date', label: 'Current Date' },
]

export function TemplateEditor() {
    const [content, setContent] = useState('')

    const insertVariable = (variableKey: string) => {
        setContent(prev => prev + ` {{${variableKey}}} `)
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
            {/* Editor Area */}
            <div className="lg:col-span-3 flex flex-col gap-4 h-full">
                {/* Toolbar */}
                <div className="flex items-center gap-1 p-2 border rounded-md bg-white">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Bold className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Italic className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Underline className="h-4 w-4" />
                    </Button>
                    <div className="w-px h-6 bg-border mx-2" />
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <AlignLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <AlignCenter className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <AlignRight className="h-4 w-4" />
                    </Button>
                    <div className="w-px h-6 bg-border mx-2" />
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <List className="h-4 w-4" />
                    </Button>
                </div>

                {/* Text Area */}
                <Textarea
                    className="flex-1 font-mono text-sm resize-none p-4 leading-relaxed"
                    placeholder="Start typing your template here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-4 h-full">
                <Card className="flex-1 flex flex-col">
                    <div className="p-4 border-b font-semibold">Variables</div>
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-2">
                            {VARIABLES.map((v) => (
                                <Button
                                    key={v.key}
                                    variant="outline"
                                    className="w-full justify-start text-xs"
                                    onClick={() => insertVariable(v.key)}
                                >
                                    <Plus className="mr-2 h-3 w-3" />
                                    {v.label}
                                </Button>
                            ))}
                        </div>
                    </ScrollArea>
                </Card>

                <Card>
                    <div className="p-4 border-b font-semibold">Metadata</div>
                    <CardContent className="p-4 space-y-4">
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select defaultValue="contract">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="contract">Contract</SelectItem>
                                    <SelectItem value="pleading">Pleading</SelectItem>
                                    <SelectItem value="letter">Letter</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Input placeholder="Brief description" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
