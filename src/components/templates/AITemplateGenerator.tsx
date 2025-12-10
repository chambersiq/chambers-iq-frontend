import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Sparkles, Loader2, Upload, FileText, X } from 'lucide-react'
import { useUploadTemplateSample, useGenerateTemplate } from '@/hooks/api/useTemplates'
import { useAuth } from '@/hooks/api/useCompany'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'

interface AITemplateGeneratorProps {
    onGenerate: (content: string) => void
}

export function AITemplateGenerator({ onGenerate }: AITemplateGeneratorProps) {
    const { user } = useAuth()
    const companyId = user?.companyId || ''

    // Hooks
    const uploadSample = useUploadTemplateSample(companyId)
    const generateTemplate = useGenerateTemplate(companyId)

    const [prompt, setPrompt] = useState('')
    const [files, setFiles] = useState<File[]>([])
    const [isGenerating, setIsGenerating] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [statusMessage, setStatusMessage] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(prev => [...prev, ...Array.from(e.target.files!)])
        }
    }

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
    }

    const handleGenerate = async () => {
        if (!prompt) return

        setIsGenerating(true)
        const generationId = uuidv4()

        try {
            // Step 1: Upload Documents
            if (files.length > 0) {
                setStatusMessage('Uploading sample documents...')
                const uploadPromises = files.map(file =>
                    uploadSample.mutateAsync({ generationId, file })
                )
                await Promise.all(uploadPromises)
            }

            // Step 2: Generate Template
            setStatusMessage('Generating template with AI...')
            const result = await generateTemplate.mutateAsync({ generationId, prompt })

            // Step 3: Done
            setStatusMessage('Done!')
            setIsOpen(false)
            onGenerate(result.content)

            // Reset
            setPrompt('')
            setFiles([])
            setStatusMessage('')

        } catch (error) {
            console.error(error)
            toast.error("Failed to generate template", {
                description: "There was an error processing your request. Please try again."
            })
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    Generate Template with AI
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Generate Template with AI</DialogTitle>
                    <DialogDescription>
                        Describe the template you want to create and optionally upload sample files (PDF, DOCX) to guide the style.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            placeholder="e.g. Create a standard NDA for software development contractors..."
                            className="min-h-[80px]"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Sample Documents (Optional)</Label>
                        <div className="grid gap-4">
                            <div
                                className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload className="h-8 w-8 text-muted-foreground" />
                                <div className="text-sm text-muted-foreground text-center">
                                    <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                                    <br />
                                    PDF or DOCX files
                                </div>
                                <Input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    multiple
                                    accept=".pdf,.docx,.doc"
                                    onChange={handleFileChange}
                                />
                            </div>

                            {files.length > 0 && (
                                <div className="space-y-2">
                                    {files.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded border text-sm">
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                                <span className="truncate">{file.name}</span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={() => removeFile(index)}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleGenerate} disabled={!prompt || isGenerating}>
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {statusMessage || 'Generating...'}
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Generate Template
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
