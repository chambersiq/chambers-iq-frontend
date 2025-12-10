'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Upload, X, FileText, AlertCircle, Sparkles } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

export function DocumentUploader() {
    const [dragActive, setDragActive] = useState(false)
    const [files, setFiles] = useState<File[]>([])
    const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
    const inputRef = useRef<HTMLInputElement>(null)

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(Array.from(e.dataTransfer.files))
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (e.target.files && e.target.files[0]) {
            handleFiles(Array.from(e.target.files))
        }
    }

    const handleFiles = (newFiles: File[]) => {
        setFiles(prev => [...prev, ...newFiles])
        // Simulate upload progress
        newFiles.forEach(file => {
            let progress = 0
            const interval = setInterval(() => {
                progress += 10
                setUploadProgress(prev => ({ ...prev, [file.name]: progress }))
                if (progress >= 100) clearInterval(interval)
            }, 200)
        })
    }

    const removeFile = (fileName: string) => {
        setFiles(prev => prev.filter(f => f.name !== fileName))
        setUploadProgress(prev => {
            const newProgress = { ...prev }
            delete newProgress[fileName]
            return newProgress
        })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Document
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Upload Documents</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Drag & Drop Zone */}
                    <div
                        className={cn(
                            "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                            dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                        )}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => inputRef.current?.click()}
                    >
                        <input
                            ref={inputRef}
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleChange}
                            accept=".pdf,.doc,.docx,.txt"
                        />
                        <div className="flex flex-col items-center gap-2 cursor-pointer">
                            <Upload className="h-10 w-10 text-muted-foreground" />
                            <p className="text-sm font-medium">
                                Drag & drop files here, or click to select
                            </p>
                            <p className="text-xs text-muted-foreground">
                                PDF, Word, or Text files up to 50MB
                            </p>
                        </div>
                    </div>

                    {/* File List */}
                    {files.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium">Selected Files</h4>
                            {files.map((file) => (
                                <div key={file.name} className="flex items-center gap-4 rounded-md border p-3">
                                    <FileText className="h-8 w-8 text-blue-500" />
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium">{file.name}</p>
                                            <button onClick={() => removeFile(file.name)}>
                                                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                            </button>
                                        </div>
                                        <Progress value={uploadProgress[file.name] || 0} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Metadata Form (for first file only as example) */}
                    {files.length > 0 && (
                        <div className="space-y-4 border-t pt-4">
                            <h4 className="text-sm font-medium">Document Details</h4>
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label>Document Title</Label>
                                    <Input placeholder="e.g. Plaint, Vakalatnama" />
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Document Type</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pleading">Pleading / Plaint</SelectItem>
                                                <SelectItem value="motion">Application</SelectItem>
                                                <SelectItem value="evidence">Evidence</SelectItem>
                                                <SelectItem value="contract">Vakalatnama</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Summary</Label>
                                        <Textarea
                                            placeholder="Brief summary (optional if AI generation is selected)"
                                            className="h-20 resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 bg-purple-50 p-3 rounded-md border border-purple-100">
                                <Checkbox id="ai-process" defaultChecked />
                                <Label htmlFor="ai-process" className="font-normal flex items-center gap-2 cursor-pointer">
                                    <Sparkles className="h-4 w-4 text-purple-600" />
                                    Auto-generate Summary using AI
                                </Label>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setFiles([])}>Cancel</Button>
                        <Button disabled={files.length === 0}>Upload {files.length} Files</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
