'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Sparkles, Loader2 } from 'lucide-react'

interface AITemplateGeneratorProps {
    onGenerate: (content: string) => void
}

export function AITemplateGenerator({ onGenerate }: AITemplateGeneratorProps) {
    const [prompt, setPrompt] = useState('')
    const [samples, setSamples] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const handleGenerate = () => {
        setIsGenerating(true)
        // Simulate generation delay
        setTimeout(() => {
            setIsGenerating(false)
            setIsOpen(false)

            // Mock generation logic
            const generatedContent = `AGREEMENT

This Agreement is made on {{current_date}} between {{client_name}} ("Client") and {{opposing_party}} ("Contractor").

1. SERVICES
Contractor agrees to provide the following services: ${prompt}

2. REFERENCE MATERIALS
Based on the provided samples:
${samples.split('\n').map(s => `> ${s}`).join('\n')}

3. JURISDICTION
This agreement shall be governed by the laws of [Jurisdiction].

IN WITNESS WHEREOF, the parties have executed this Agreement.

________________________
{{client_name}}

________________________
{{opposing_party}}`

            onGenerate(generatedContent)
        }, 2000)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    Generate with AI
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Generate Template with AI</DialogTitle>
                    <DialogDescription>
                        Describe the document and provide samples to help the AI understand the style and structure.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            placeholder="e.g. Create a Non-Disclosure Agreement for a software contractor in California..."
                            className="min-h-[80px]"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Samples / Context</Label>
                        <Textarea
                            placeholder="Paste similar clauses, sample contracts, or list of requirements here..."
                            className="min-h-[150px]"
                            value={samples}
                            onChange={(e) => setSamples(e.target.value)}
                        />
                        <div className="text-xs text-muted-foreground">
                            The AI will use these samples to match the tone and structure.
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleGenerate} disabled={!prompt || isGenerating}>
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Generate Draft
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
