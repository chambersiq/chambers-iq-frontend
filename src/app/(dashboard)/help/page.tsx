'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    HelpCircle,
    Book,
    MessageCircle,
    FileText,
    Sparkles,
    Mail,
    Phone,
    ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export default function HelpPage() {
    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900">Help Center</h1>
                <p className="text-slate-600 max-w-2xl">
                    Find answers to common questions, learn how to use Chambers IQ, or get in touch with our support team.
                </p>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-blue-100 bg-blue-50/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-700">
                            <Book className="h-5 w-5" />
                            Documentation
                        </CardTitle>
                        <CardDescription>
                            Comprehensive guides for all features.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="link" className="p-0 h-auto text-blue-600 font-semibold" asChild>
                            <Link href="#" className="flex items-center gap-1">
                                Browse Guides <ExternalLink className="h-3 w-3" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="border-purple-100 bg-purple-50/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-purple-700">
                            <Sparkles className="h-5 w-5" />
                            AI Features
                        </CardTitle>
                        <CardDescription>
                            Learn how to get the best results from AI.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="link" className="p-0 h-auto text-purple-600 font-semibold" asChild>
                            <Link href="#" className="flex items-center gap-1">
                                AI Tips & Tricks <ExternalLink className="h-3 w-3" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="border-orange-100 bg-orange-50/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-orange-700">
                            <MessageCircle className="h-5 w-5" />
                            Support
                        </CardTitle>
                        <CardDescription>
                            Need help? Our team is available 24/7.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-slate-600 space-y-1">
                            <div className="flex items-center gap-2">
                                <Mail className="h-3 w-3" /> support@chambersiq.com
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="h-3 w-3" /> +91 1800-123-4567
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* FAQ Section */}
            <div className="grid gap-8 lg:grid-cols-12">
                <div className="lg:col-span-8 space-y-6">
                    <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>

                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>How do I upload case documents?</AccordionTrigger>
                            <AccordionContent>
                                Navigate to the <strong>Documents</strong> section from the sidebar or within a specific Case. Click "Quick Upload" or "Upload Document". You can select a specific Client and Case to ensure the files are organized correctly.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>How does the AI Summarizer work?</AccordionTrigger>
                            <AccordionContent>
                                When uploading a document (PDF, DOCX, TXT), check the <strong>"Auto-generate Summary"</strong> box. Our AI analyzes the content and extracts key dates, parties, and a brief summary. This process usually takes 10-20 seconds.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>Can I edit AI-generated drafts?</AccordionTrigger>
                            <AccordionContent>
                                Yes! Navigate to the <strong>Drafts</strong> section. All AI-generated documents are fully editable. You can modify text, add clauses, and format the document before exporting it as a PDF or Word file.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                            <AccordionTrigger>Is my client data secure?</AccordionTrigger>
                            <AccordionContent>
                                Absolutely. All documents are encrypted at rest and in transit. We use enterprise-grade security protocols (SOC2 compliant infrastructure) to ensure confidentiality. AI processing is done in a private environment where data is not used for model training.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-5">
                            <AccordionTrigger>How do I add a team member?</AccordionTrigger>
                            <AccordionContent>
                                Go to <strong>Settings {'>'} Team Management</strong>. Click "Invite Member" and enter their email address. They will receive an invitation link to join your firm's workspace.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                {/* Sidebar / Contact Card */}
                <div className="lg:col-span-4 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Still need help?</CardTitle>
                            <CardDescription>
                                We're here to assist you with any issues.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button className="w-full gap-2">
                                <MessageCircle className="h-4 w-4" />
                                Start Live Chat
                            </Button>
                            <Button variant="outline" className="w-full gap-2">
                                <Mail className="h-4 w-4" />
                                Email Support
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm text-slate-500">
                        <h4 className="font-semibold text-slate-700 mb-2">System Status</h4>
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            All systems operational
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
