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

                    {/* Case Management */}
                    <div className="space-y-3">
                        <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                            <span className="text-2xl">🏛️</span> Case Management & Indian Law System
                        </h3>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="cm-1">
                                <AccordionTrigger>What makes Chambers IQ different from other legal software?</AccordionTrigger>
                                <AccordionContent>
                                    Chambers IQ is specifically designed for Indian legal practice with comprehensive Indian court hierarchies, legal document types, and case categorization. It includes Supreme Court, High Courts, District Courts, and all major tribunals with proper legal document classification.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="cm-2">
                                <AccordionTrigger>How do I create a case with proper Indian legal categorization?</AccordionTrigger>
                                <AccordionContent>
                                    When creating a case, select the Practice Area (Civil Litigation, Criminal Litigation, Family Law, etc.), then choose the specific Case Type (Civil Suit, Cheque Bounce, Divorce Petition, etc.). The system automatically validates document types and suggests relevant templates based on your selections.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="cm-3">
                                <AccordionTrigger>What are Practice Areas and Case Types in the Indian legal system?</AccordionTrigger>
                                <AccordionContent>
                                    Practice Areas group cases by legal domain (Civil, Criminal, Family, Corporate, etc.). Case Types are specific matters within each practice area, such as "Civil Suit (Money Recovery)" or "Cheque Bounce (138 NI Act)". These determine allowed documents and court procedures.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="cm-4">
                                <AccordionTrigger>How does the court level selection work?</AccordionTrigger>
                                <AccordionContent>
                                    Court levels include Supreme Court (SC), High Courts (HC), District Courts (DC), and specialized tribunals. Selecting the appropriate court level ensures templates and documents are tailored to the correct jurisdiction's requirements.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>

                    {/* Document Management */}
                    <div className="space-y-3 pt-4">
                        <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                            <span className="text-2xl">📄</span> Document Management & Validation
                        </h3>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="dm-1">
                                <AccordionTrigger>What document types can I upload for Indian legal cases?</AccordionTrigger>
                                <AccordionContent>
                                    The system supports 33+ Indian legal document types including Plaint, Written Statement, Bail Applications, Writ Petitions, Cheque Bounce complaints, and many more. Each document type is validated against the case type to ensure legal compliance.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="dm-2">
                                <AccordionTrigger>How does document validation work?</AccordionTrigger>
                                <AccordionContent>
                                    When uploading documents to a case, the system checks if the document type is allowed for that specific case type. For example, you cannot upload a "Divorce Petition" to a "Civil Suit (Money Recovery)" case. This prevents legal errors.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="dm-3">
                                <AccordionTrigger>Can I upload documents in any format?</AccordionTrigger>
                                <AccordionContent>
                                    Yes, we support PDF, DOCX, and TXT files. For PDF and DOCX files, you can enable AI analysis to automatically extract key information, parties, dates, and generate summaries.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>

                    {/* Template System */}
                    <div className="space-y-3 pt-4">
                        <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                            <span className="text-2xl">📝</span> Template System & AI Drafting
                        </h3>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="ts-1">
                                <AccordionTrigger>How do templates work with Indian legal documents?</AccordionTrigger>
                                <AccordionContent>
                                    Templates are categorized by Document Type, Court Level, and Case Type. For example, a "Plaint for Civil Suit" template will only be suggested for Civil Litigation cases in appropriate courts. This ensures legal accuracy.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="ts-2">
                                <AccordionTrigger>What is the AI Template Architect?</AccordionTrigger>
                                <AccordionContent>
                                    The AI Template Architect is an advanced workflow that helps create custom legal documents. You describe your requirements in natural language, and the AI drafts a template with proper legal structure, then iteratively refines it based on your feedback.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="ts-3">
                                <AccordionTrigger>How do I find the right template for my case?</AccordionTrigger>
                                <AccordionContent>
                                    Templates are automatically filtered by your case's Document Type, Court Level, and Case Type. The system suggests the most relevant templates, or you can browse all templates filtered by legal category.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="ts-4">
                                <AccordionTrigger>Can I create custom templates for my firm?</AccordionTrigger>
                                <AccordionContent>
                                    Yes! Create templates from scratch or modify existing ones. Tag them with appropriate Indian legal document types, court levels, and case types so they're suggested to the right cases automatically.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>

                    {/* AI Features */}
                    <div className="space-y-3 pt-4">
                        <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                            <span className="text-2xl">🤖</span> AI Features & Workflows
                        </h3>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="ai-1">
                                <AccordionTrigger>What AI capabilities does Chambers IQ offer?</AccordionTrigger>
                                <AccordionContent>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li><strong>Document Analysis</strong>: Extracts parties, dates, key facts from legal documents</li>
                                        <li><strong>Legal Summaries</strong>: Generates concise summaries of case documents</li>
                                        <li><strong>AI Drafting</strong>: Creates legal documents from natural language descriptions</li>
                                        <li><strong>Template Suggestions</strong>: Recommends appropriate templates based on case context</li>
                                        <li><strong>Workflow Automation</strong>: Guides through complex document creation processes</li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="ai-2">
                                <AccordionTrigger>How secure is the AI processing?</AccordionTrigger>
                                <AccordionContent>
                                    All AI processing happens in a private, secure environment. Your data is never used for model training, and all processing complies with Indian legal data protection standards.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="ai-3">
                                <AccordionTrigger>What is the difference between AI Summarizer and AI Template Architect?</AccordionTrigger>
                                <AccordionContent>
                                    AI Summarizer analyzes existing documents to extract information. AI Template Architect creates new legal documents from scratch based on your descriptions and goes through an iterative review process.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>

                    {/* Client Management */}
                    <div className="space-y-3 pt-4">
                        <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                            <span className="text-2xl">👥</span> Client & Team Management
                        </h3>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="cmg-1">
                                <AccordionTrigger>How do I add clients with Indian legal entity types?</AccordionTrigger>
                                <AccordionContent>
                                    When creating clients, select from Indian legal entity types including Individual, Private Limited Company, Hindu Undivided Family (HUF), Limited Liability Partnership (LLP), Partnership Firm, Trust, and Society. Each type has specific identification requirements.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="cmg-2">
                                <AccordionTrigger>What client information should I capture?</AccordionTrigger>
                                <AccordionContent>
                                    For individuals: Full name, PAN, contact details. For companies: CIN, GSTIN, registered address. The system validates required fields based on the selected entity type.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="cmg-3">
                                <AccordionTrigger>How does team collaboration work?</AccordionTrigger>
                                <AccordionContent>
                                    Invite team members by email. Set roles (Partner, Associate, Junior Associate, etc.) with appropriate permissions. All team members can access shared cases, documents, and templates within your firm's workspace.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>

                    {/* Security */}
                    <div className="space-y-3 pt-4">
                        <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                            <span className="text-2xl">🔒</span> Security & Compliance
                        </h3>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="sec-1">
                                <AccordionTrigger>How is my legal data protected?</AccordionTrigger>
                                <AccordionContent>
                                    All data is encrypted at rest and in transit. We use AWS enterprise-grade security, SOC2 compliance, and follow Indian legal data protection standards. Documents are stored in private S3 buckets with strict access controls.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="sec-2">
                                <AccordionTrigger>Can multiple people work on the same case?</AccordionTrigger>
                                <AccordionContent>
                                    Yes! Cases, documents, and drafts are shared within your firm. You can see who made changes and when, with full audit trails for legal compliance.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="sec-3">
                                <AccordionTrigger>What happens if I lose internet connection?</AccordionTrigger>
                                <AccordionContent>
                                    Chambers IQ works offline for document editing and case review. Changes sync when connection is restored. All your work is automatically saved.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>

                    {/* Support */}
                    <div className="space-y-3 pt-4">
                        <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                            <span className="text-2xl">🛠️</span> Technical Support & Troubleshooting
                        </h3>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="sup-1">
                                <AccordionTrigger>The system is slow - what can I do?</AccordionTrigger>
                                <AccordionContent>
                                    Check your internet connection. Clear browser cache. The app is optimized for modern browsers. For persistent issues, contact support with your browser type and version.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="sup-2">
                                <AccordionTrigger>I can't find a specific document type - what should I do?</AccordionTrigger>
                                <AccordionContent>
                                    The system includes all major Indian legal document types. If you need a specialized document type, contact support to have it added to the master data.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="sup-3">
                                <AccordionTrigger>How do I export documents for court filing?</AccordionTrigger>
                                <AccordionContent>
                                    All documents can be downloaded as PDF or Word format. The system maintains proper legal formatting and includes all necessary metadata.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="sup-4">
                                <AccordionTrigger>Can I integrate Chambers IQ with other legal software?</AccordionTrigger>
                                <AccordionContent>
                                    Currently, we focus on being a comprehensive standalone solution. API access may be available for enterprise clients - contact sales for integration options.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="sup-5">
                                <AccordionTrigger>How do I backup my firm's data?</AccordionTrigger>
                                <AccordionContent>
                                    All data is automatically backed up daily. You can export cases, documents, and templates individually, or request bulk exports from support.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>

                    {/* Advanced */}
                    <div className="space-y-3 pt-4">
                        <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                            <span className="text-2xl">💼</span> Advanced Features
                        </h3>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="adv-1">
                                <AccordionTrigger>What are Important Dates and how do they work?</AccordionTrigger>
                                <AccordionContent>
                                    Track critical deadlines like limitation periods, hearing dates, and filing deadlines. The system sends reminders and helps ensure you don't miss important dates.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="adv-2">
                                <AccordionTrigger>How does the financial tracking work?</AccordionTrigger>
                                <AccordionContent>
                                    Record professional fees, court fees, and expenses. Set billing arrangements (hourly, contingency, flat fee) and track costs advanced to clients.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="adv-3">
                                <AccordionTrigger>Can I create custom workflows?</AccordionTrigger>
                                <AccordionContent>
                                    While the system has standard workflows, custom workflows can be configured for specific practice areas. Contact support for advanced workflow setup.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
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
