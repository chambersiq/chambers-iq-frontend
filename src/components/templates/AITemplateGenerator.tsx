'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Sparkles, Loader2 } from 'lucide-react'

export function AITemplateGenerator() {
    const [prompt, setPrompt] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const handleGenerate = () => {
        setIsGenerating(true)
        // Simulate generation delay
        setTimeout(() => {
            setIsGenerating(false)
            setIsOpen(false)
            // In a real app, this would update the editor content
            console.log('Generated template for:', prompt)
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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Generate Template</DialogTitle>
                    <DialogDescription>
                        Describe the legal document you need, and AI will create a starting draft with variables.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <Textarea
                        placeholder="e.g. Create a Non-Disclosure Agreement for a software contractor in California..."
                        className="min-h-[100px]"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                    <div className="text-xs text-muted-foreground">
                        Tip: Be specific about jurisdiction and parties involved.
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
