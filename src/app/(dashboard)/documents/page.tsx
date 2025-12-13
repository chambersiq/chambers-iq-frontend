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
import { useCases } from '@/hooks/api/useCases'
import { useClients } from '@/hooks/api/useClients'
import { useAuth } from '@/hooks/useAuth'

export default function DocumentsPage() {
    const { user } = useAuth()
    const companyId = user?.companyId || ''
    const { data: cases = [], isLoading: isLoadingCases } = useCases(companyId)
    const { data: clients = [], isLoading: isLoadingClients } = useClients(companyId)

    const [searchQuery, setSearchQuery] = useState('')
    const [selectedClient, setSelectedClient] = useState<string>('all')

    // Helper to get client name
    const getClientName = (clientId: string) => {
        const client = clients.find(c => c.clientId === clientId)
        if (!client) return 'Unknown Client'
        return client.clientType === 'individual' ? client.fullName : client.companyName
    }

    // Extract unique clients for filter
    // We use the fetched clients list to populate the dropdown with valid names
    const uniqueClientIds = Array.from(new Set(cases.map(c => c.clientId))).filter(Boolean)
    const filterOptions = uniqueClientIds.map(id => ({
        id,
        name: getClientName(id)
    })).sort((a, b) => a.name.localeCompare(b.name))

    // Filter logic
    const filteredCases = cases.filter(c => {
        const clientName = getClientName(c.clientId)
        const matchesSearch = c.caseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (c.caseNumber || '').toLowerCase().includes(searchQuery.toLowerCase())
        const matchesClient = selectedClient === 'all' || c.clientId === selectedClient
        return matchesSearch && matchesClient
    })

    if (isLoadingCases || isLoadingClients) {
        return <div className="p-8 text-center text-slate-500">Loading...</div>
    }

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
                            {filterOptions.map(option => (
                                <SelectItem key={option.id} value={option.id}>{option.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Case List */}
            <div className="space-y-4">
                {filteredCases.map((caseItem) => (
                    <Link key={caseItem.caseId} href={`/documents/cases/${caseItem.caseId}`}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer border-slate-200 hover:border-blue-300 group">
                            <CardContent className="p-4 flex items-center gap-6">
                                {/* Icon */}
                                <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors shrink-0">
                                    <Folder className="h-6 w-6 text-blue-600" />
                                </div>

                                {/* Main Info Grid */}
                                <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                    {/* Name & Number */}
                                    <div className="md:col-span-4 min-w-0">
                                        <h3 className="font-semibold text-base text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                                            {caseItem.caseName}
                                        </h3>
                                        <p className="text-sm text-slate-500 truncate">{caseItem.caseNumber}</p>
                                    </div>

                                    {/* Client */}
                                    <div className="md:col-span-3 hidden md:block">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Client:</span>
                                            <span className="text-sm font-medium text-slate-700 truncate">{getClientName(caseItem.clientId)}</span>
                                        </div>
                                    </div>

                                    {/* Type */}
                                    <div className="md:col-span-3 hidden md:block">
                                        <Badge variant="outline" className="font-normal capitalize bg-slate-50">
                                            {(caseItem.caseType || (caseItem.caseTypeId || 'General')).replace(/_/g, ' ').replace(/-/g, ' ')}
                                        </Badge>
                                    </div>

                                    {/* Date */}
                                    <div className="md:col-span-2 text-right text-sm text-slate-500 hidden md:block">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <Clock className="h-3.5 w-3.5" />
                                            <span>{new Date(caseItem.updatedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Icon */}
                                <div className="shrink-0 text-slate-400 group-hover:text-blue-600 transition-colors pl-4 border-l border-slate-100">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <span className="hidden md:inline">View Files</span>
                                        <FileText className="h-4 w-4" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}

                {filteredCases.length === 0 && (
                    <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-lg border border-dashed">
                        No cases found matching your filters.
                    </div>
                )}
            </div>
        </div>
    )
}
