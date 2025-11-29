'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NewDraftPage() {
    const router = useRouter()

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault()
        // In a real app, create draft then redirect
        router.push('/drafts/1')
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/drafts">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Start New Draft</h1>
                    <p className="mt-2 text-slate-600">
                        Choose a case and document type to begin.
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Draft Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreate} className="space-y-6">
                        <div className="space-y-2">
                            <Label>Select Case</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a case..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Smith v. Jones</SelectItem>
                                    <SelectItem value="2">State v. Doe</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Document Name</Label>
                            <Input placeholder="e.g. Motion to Compel Discovery" />
                        </div>

                        <div className="space-y-2">
                            <Label>Starting Point</Label>
                            <Select defaultValue="blank">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="blank">Blank Document</SelectItem>
                                    <SelectItem value="template">From Template</SelectItem>
                                    <SelectItem value="ai">AI Generated Draft</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <Button type="button" variant="outline" onClick={() => router.back()}>
                                Cancel
                            </Button>
                            <Button type="submit" className="gap-2">
                                <Sparkles className="h-4 w-4" />
                                Start Drafting
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
