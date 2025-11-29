import { Button } from '@/components/ui/button'
import { ArrowLeft, Download, Share2 } from 'lucide-react'
import Link from 'next/link'
import { AIAnalysisPanel } from '@/components/documents/AIAnalysisPanel'

export default function DocumentViewerPage({ params }: { params: { id: string } }) {
    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col">
            {/* Viewer Header */}
            <div className="h-14 border-b bg-white flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <Link href="/documents">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="font-semibold text-sm">Complaint.pdf</h1>
                        <p className="text-xs text-muted-foreground">Uploaded by John Doe • 2 days ago</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Share2 className="mr-2 h-4 w-4" /> Share
                    </Button>
                    <Button size="sm">
                        <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                </div>
            </div>

            {/* Split View */}
            <div className="flex-1 flex overflow-hidden">
                {/* PDF Viewer Placeholder */}
                <div className="flex-1 bg-slate-100 flex items-center justify-center p-8">
                    <div className="bg-white shadow-lg w-full max-w-3xl h-full rounded-sm p-12 flex flex-col items-center justify-center text-slate-300 border">
                        <div className="text-center space-y-4">
                            <div className="w-24 h-32 border-2 border-dashed border-slate-300 mx-auto rounded flex items-center justify-center">
                                PDF
                            </div>
                            <p>PDF Viewer Component Placeholder</p>
                            <p className="text-sm">(react-pdf integration would go here)</p>
                        </div>
                    </div>
                </div>

                {/* AI Panel */}
                <AIAnalysisPanel />
            </div>
        </div>
    )
}
