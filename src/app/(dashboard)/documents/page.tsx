'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, Folder, Search, FileText, Clock, Filter } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// Mock Cases with stats and clients
const cases = [
    { id: '1', name: 'Smith v. Jones', number: 'CV-2024-001', type: 'Civil Litigation', client: 'John Smith', docCount: 24, lastUpdated: '2 hours ago' },
    { id: '2', name: 'State v. Doe', number: 'CR-2024-045', type: 'Criminal Defense', client: 'Jane Doe', docCount: 12, lastUpdated: '1 day ago' },
    { id: '3', name: 'Tech Corp Merger', number: 'Corp-2024-102', type: 'Corporate', client: 'Tech Corp Inc.', docCount: 156, lastUpdated: '3 days ago' },
    { id: '4', name: 'Estate of H. Granger', number: 'Prob-2024-012', type: 'Probate', client: 'Hermione Granger', docCount: 8, lastUpdated: '1 week ago' },
    { id: '5', name: 'Tech Corp v. Startup', number: 'Corp-2024-105', type: 'Corporate', client: 'Tech Corp Inc.', docCount: 45, lastUpdated: '5 hours ago' },
]

// Extract unique clients
const clients = Array.from(new Set(cases.map(c => c.client))).sort()

export default function DocumentsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedClient, setSelectedClient] = useState<string>('all')

    // Filter logic
    const filteredCases = cases.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.number.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesClient = selectedClient === 'all' || c.client === selectedClient
        return matchesSearch && matchesClient
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Documents</h1>
                    <p className="mt-2 text-slate-600">Select a case to manage its documents</p>
                </div>
                <Link href="/documents/new">
                    <Button>
                        <Upload className="mr-2 h-4 w-4" />
                        Quick Upload
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search cases..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="w-[200px]">
                    <Select value={selectedClient} onValueChange={setSelectedClient}>
                        <SelectTrigger>
                            <div className="flex items-center gap-2 text-slate-600">
                                <Filter className="h-4 w-4" />
                                <SelectValue placeholder="Filter by Client" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Clients</SelectItem>
                            {clients.map(client => (
                                <SelectItem key={client} value={client}>{client}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Case Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredCases.map((caseItem) => (
                    <Link key={caseItem.id} href={`/documents/cases/${caseItem.id}`}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer border-slate-200 hover:border-blue-300 group h-full">
                            <CardContent className="p-6 flex flex-col h-full">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                        <Folder className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <Badge variant="outline" className="font-normal">
                                        {caseItem.type}
                                    </Badge>
                                </div>

                                <div className="space-y-1 mb-4 flex-1">
                                    <h3 className="font-semibold text-lg text-slate-900 group-hover:text-blue-700 transition-colors">
                                        {caseItem.name}
                                    </h3>
                                    <p className="text-sm text-slate-500">{caseItem.number}</p>
                                    <p className="text-xs text-slate-400 mt-1">Client: {caseItem.client}</p>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t text-sm text-slate-500 mt-auto">
                                    <div className="flex items-center gap-1.5">
                                        <FileText className="h-4 w-4" />
                                        <span>{caseItem.docCount} files</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-4 w-4" />
                                        <span>{caseItem.lastUpdated}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}

                {filteredCases.length === 0 && (
                    <div className="col-span-full text-center py-12 text-slate-500 bg-slate-50 rounded-lg border border-dashed">
                        No cases found matching your filters.
                    </div>
                )}
            </div>
        </div>
    )
}
