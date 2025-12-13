'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Search,
    Book,
    FileText,
    Sparkles,
    Settings,
    Shield,
    MessageCircle,
    Mail,
    ChevronRight,
    PlayCircle
} from 'lucide-react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import Link from 'next/link'

// --- Data Structure ---
type FAQCategory = 'getting-started' | 'documents' | 'ai-tools' | 'security' | 'account'

const CATEGORIES: { id: FAQCategory; label: string; icon: any; desc: string }[] = [
    { id: 'getting-started', label: 'Getting Started', icon: Book, desc: 'First case, team setup' },
    { id: 'documents', label: 'Documents', icon: FileText, desc: 'Uploads, templates' },
    { id: 'ai-tools', label: 'AI Features', icon: Sparkles, desc: 'Drafting, analysis' },
    { id: 'security', label: 'Security', icon: Shield, desc: 'Data protection' },
    { id: 'account', label: 'Account', icon: Settings, desc: 'Billing, settings' },
]

const FAQ_ITEMS = [
    {
        id: 'gs-1',
        category: 'getting-started',
        question: 'Why choose Chambers IQ for Indian Law?',
        answer: (
            <div className="space-y-4">
                <p>Unlike generic software, we are built specifically for the Indian legal framework:</p>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div className="flex gap-2 items-start">
                        <span className="text-green-500 font-bold shrink-0">✓</span>
                        <span><strong>Full Court Hierarchy:</strong> SC, HC, DC, and Specialized Tribunals mapping.</span>
                    </div>
                    <div className="flex gap-2 items-start">
                        <span className="text-green-500 font-bold shrink-0">✓</span>
                        <span><strong>33+ Document Types:</strong> Native support for Indian instruments (Plaints, Writ Petitions).</span>
                    </div>
                    <div className="flex gap-2 items-start">
                        <span className="text-green-500 font-bold shrink-0">✓</span>
                        <span><strong>Automated Categorisation:</strong> Prevents procedural errors by validating document types against case types.</span>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'gs-2',
        category: 'getting-started',
        question: 'How do I create my first case?',
        answer: (
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                    <span className="bg-slate-100 px-2 py-1 rounded">Step-by-Step Guide</span>
                </div>
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between text-center md:text-left text-sm">
                    <div className="flex-1 p-3 bg-slate-50 border rounded-lg w-full">
                        <div className="font-bold text-slate-900 mb-1">1. New Case</div>
                        Click the "+ Case" button on dashboard.
                    </div>
                    <ChevronRight className="hidden md:block text-slate-400" />
                    <div className="flex-1 p-3 bg-slate-50 border rounded-lg w-full">
                        <div className="font-bold text-slate-900 mb-1">2. Basic Info</div>
                        Select Practice Area & Case Type.
                    </div>
                    <ChevronRight className="hidden md:block text-slate-400" />
                    <div className="flex-1 p-3 bg-slate-50 border rounded-lg w-full">
                        <div className="font-bold text-slate-900 mb-1">3. Details</div>
                        Add Client, Court, and Filing Date.
                    </div>
                </div>
                <div className="bg-blue-50 text-blue-800 p-3 rounded-md text-sm border border-blue-100">
                    💡 <strong>Pro Tip:</strong> Ensure you select the correct <em>Court Level</em> to unlock jurisdiction-specific templates.
                </div>
            </div>
        )
    },
    {
        id: 'ai-1',
        category: 'ai-tools',
        question: 'AI Summarizer vs. AI Template Architect - What\'s the difference?',
        answer: (
            <div className="space-y-4">
                <div className="border rounded-lg overflow-hidden text-sm">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b">
                            <tr>
                                <th className="p-3 font-semibold text-slate-700">Feature</th>
                                <th className="p-3 font-semibold text-blue-700">AI Summarizer</th>
                                <th className="p-3 font-semibold text-purple-700">AI Template Architect</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            <tr>
                                <td className="p-3 font-medium text-slate-600">Goal</td>
                                <td className="p-3">Analyze existing files</td>
                                <td className="p-3">Create new documents</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-medium text-slate-600">Input</td>
                                <td className="p-3">PDF / DOCX / Text</td>
                                <td className="p-3">Natural Language Description</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-medium text-slate-600">Result</td>
                                <td className="p-3">Key dates & Facts Summary</td>
                                <td className="p-3">Full, editable legal draft</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    },
    {
        id: 'ai-2',
        category: 'ai-tools',
        question: 'How does AI Drafting work?',
        answer: (
            <div className="space-y-2">
                <p className="text-slate-600 mb-2">Transform a simple instruction into a comprehensive legal draft in minutes.</p>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="font-mono text-xs text-slate-500 mb-2">Example Prompt:</div>
                    <p className="italic text-slate-800 font-medium">
                        "Draft a Statutory Notice for Cheque Bounce under Section 138 against Mr. Rahul Kumar for a cheque of ₹5 Lakhs dated 15th Aug 2025."
                    </p>
                </div>
                <p className="text-sm text-slate-600 mt-2">
                    The AI extracts the Section, Amount, Date, and Names to populate the correct legal template automatically.
                </p>
            </div>
        )
    },
    {
        id: 'doc-1',
        category: 'documents',
        question: 'What documents can I upload?',
        answer: (
            <div className="space-y-2">
                <p>We support standard formats with built-in OCR and analysis capabilities.</p>
                <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-medium border border-red-100">PDF</span>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">DOCX</span>
                    <span className="px-3 py-1 bg-slate-50 text-slate-700 rounded-full text-sm font-medium border border-slate-200">TXT</span>
                </div>
                <p className="text-sm text-slate-500 mt-2">
                    <strong>Note:</strong> Maximum file size is 25MB per document.
                </p>
            </div>
        )
    },
    {
        id: 'sec-1',
        category: 'security',
        question: 'Is my client data safe?',
        answer: (
            <div className="space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded border shadow-sm">
                        <div className="font-semibold text-slate-900 mb-1">🔒 Bank-Grade Encryption</div>
                        <div className="text-xs text-slate-500">AES-256 (At Rest) & TLS 1.3 (In Transit)</div>
                    </div>
                    <div className="bg-white p-3 rounded border shadow-sm">
                        <div className="font-semibold text-slate-900 mb-1">🛡️ Zero Training</div>
                        <div className="text-xs text-slate-500">Your data is NEVER used to train our public AI models.</div>
                    </div>
                </div>
                <p className="text-xs text-slate-500 text-center pt-1">
                    Compliant with Indian Digital Personal Data Protection (DPDP) standards.
                </p>
            </div>
        )
    }
]

export default function HelpPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [activeCategory, setActiveCategory] = useState<string | 'all'>('all')

    const filteredItems = FAQ_ITEMS.filter(item => {
        const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (typeof item.answer === 'string' && item.answer.toLowerCase().includes(searchQuery.toLowerCase()))
        const matchesCategory = activeCategory === 'all' || item.category === activeCategory
        return matchesSearch && matchesCategory
    })

    return (
        <div className="max-w-5xl mx-auto pb-20 space-y-10">

            {/* 1. Hero Search Section */}
            <div className="text-center space-y-6 py-10">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                    How can we help you?
                </h1>
                <div className="relative max-w-xl mx-auto">
                    <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                    <Input
                        placeholder="Search for answers (e.g., 'create case', 'AI drafting')"
                        className="pl-12 h-12 text-lg shadow-sm border-slate-200 rounded-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* 2. Category Grid (Interactive) */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {CATEGORIES.map((cat) => {
                    const Icon = cat.icon
                    const isActive = activeCategory === cat.id
                    return (
                        <div
                            key={cat.id}
                            onClick={() => setActiveCategory(isActive ? 'all' : cat.id)}
                            className={`
                                cursor-pointer rounded-xl border p-4 transition-all duration-200 text-center space-y-2 group
                                ${isActive
                                    ? 'bg-blue-50 border-blue-200 shadow-md transform scale-105'
                                    : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'
                                }
                            `}
                        >
                            <div className={`mx-auto p-3 rounded-full w-fit transition-colors ${isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-50 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600'}`}>
                                <Icon className="h-6 w-6" />
                            </div>
                            <div>
                                <div className={`font-semibold ${isActive ? 'text-blue-900' : 'text-slate-900'}`}>{cat.label}</div>
                                <div className="text-xs text-slate-500 hidden md:block">{cat.desc}</div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* 3. FAQ List (Rich Content) */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-900">
                        {searchQuery ? `Search Results` : (activeCategory === 'all' ? 'Popular Questions' : CATEGORIES.find(c => c.id === activeCategory)?.label)}
                    </h2>
                    {activeCategory !== 'all' && (
                        <Button variant="ghost" size="sm" onClick={() => setActiveCategory('all')}>
                            View All
                        </Button>
                    )}
                </div>

                <Accordion type="single" collapsible className="space-y-4">
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                            <div key={item.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow transition-shadow">
                                <AccordionItem value={item.id} className="border-none">
                                    <AccordionTrigger className="px-6 py-4 hover:no-underline lg:text-lg font-semibold text-slate-800">
                                        {item.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="px-6 pb-6 text-slate-600 text-base leading-relaxed bg-slate-50/50 pt-4 border-t border-slate-100">
                                        {item.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-slate-500">
                            <p className="text-lg">No answers found matching "{searchQuery}"</p>
                            <Button variant="link" onClick={() => setSearchQuery('')}>Clear Search</Button>
                        </div>
                    )}
                </Accordion>
            </div>

            {/* 4. Footer / Contact */}
            <div className="border-t border-slate-200 pt-10 mt-10">
                <div className="bg-slate-900 rounded-2xl p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 text-white">
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold">Still need help?</h3>
                        <p className="text-slate-300 max-w-md">Our support team is available 24/7 to assist you with any issues or questions.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                            <MessageCircle className="h-5 w-5" /> Start Live Chat
                        </Button>
                        <Button size="lg" variant="outline" className="text-white border-white/20 hover:bg-white/10 gap-2">
                            <Mail className="h-5 w-5" /> Email Support
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
