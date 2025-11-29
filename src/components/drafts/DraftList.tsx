'use client'

import { useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit3, MoreHorizontal, FileText, Trash2, ExternalLink, Search } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Draft } from '@/types/draft'
import { formatDate, formatTimeAgo } from '@/lib/utils'
import Link from 'next/link'

// Mock data
const MOCK_DRAFTS: Draft[] = [
    {
        id: '1',
        name: 'Motion to Dismiss - Smith v. Jones',
        caseId: '1',
        caseName: 'Smith v. Jones',
        clientId: '1',
        clientName: 'John Smith',
        status: 'draft',
        content: '',
        lastEditedAt: '2024-01-20T14:30:00Z',
        createdAt: '2024-01-20T10:00:00Z'
    },
    {
        id: '2',
        name: 'Settlement Agreement',
        caseId: '2',
        caseName: 'State v. Doe',
        clientId: '2',
        clientName: 'Jane Doe',
        status: 'review',
        content: '',
        lastEditedAt: '2024-01-19T09:15:00Z',
        createdAt: '2024-01-18T11:20:00Z'
    }
]

interface DraftListProps {
    caseId?: string
}

export function DraftList({ caseId }: DraftListProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [caseFilter, setCaseFilter] = useState<string>('all')
    const [clientFilter, setClientFilter] = useState<string>('all')

    // Get unique values for filters
    const cases = Array.from(new Set(MOCK_DRAFTS.map(d => JSON.stringify({ id: d.caseId, name: d.caseName }))))
        .map(s => JSON.parse(s))

    const clients = Array.from(new Set(MOCK_DRAFTS.map(d => JSON.stringify({ id: d.clientId, name: d.clientName }))))
        .map(s => JSON.parse(s))

    // Filter drafts
    const filteredDrafts = MOCK_DRAFTS.filter(d => {
        // If caseId prop is provided, strictly filter by it (ignoring the dropdown filter for case)
        if (caseId && d.caseId !== caseId) return false

        const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'all' || d.status === statusFilter
        const matchesCase = caseId ? true : (caseFilter === 'all' || d.caseId === caseFilter)
        const matchesClient = clientFilter === 'all' || d.clientId === clientFilter

        return matchesSearch && matchesStatus && matchesCase && matchesClient
    })

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-1 items-center gap-2 flex-wrap">
                    <div className="relative flex-1 min-w-[200px] md:max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search drafts..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {!caseId && (
                        <>
                            <Select value={caseFilter} onValueChange={setCaseFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by Case" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Cases</SelectItem>
                                    {cases.map((c: any) => (
                                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={clientFilter} onValueChange={setClientFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by Client" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Clients</SelectItem>
                                    {clients.map((c: any) => (
                                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </>
                    )}

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="review">Review</SelectItem>
                            <SelectItem value="final">Final</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Draft Name</TableHead>
                            {!caseId && <TableHead>Case</TableHead>}
                            <TableHead>Status</TableHead>
                            <TableHead>Last Edited</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredDrafts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={caseId ? 4 : 5} className="h-24 text-center text-muted-foreground">
                                    No drafts found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredDrafts.map((draft) => (
                                <TableRow key={draft.id}>
                                    <TableCell className="font-medium">
                                        <Link href={`/drafts/${draft.id}`} className="hover:underline text-blue-600 flex items-center gap-2">
                                            <Edit3 className="h-4 w-4" />
                                            {draft.name}
                                        </Link>
                                    </TableCell>
                                    {!caseId && (
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span>{draft.caseName}</span>
                                                <span className="text-xs text-muted-foreground">{draft.clientName}</span>
                                            </div>
                                        </TableCell>
                                    )}
                                    <TableCell>
                                        <Badge variant={draft.status === 'draft' ? 'secondary' : 'warning'} className="capitalize">
                                            {draft.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {formatTimeAgo(draft.lastEditedAt)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/drafts/${draft.id}`}>
                                                        <Edit3 className="mr-2 h-4 w-4" /> Continue Drafting
                                                    </Link>
                                                </DropdownMenuItem>
                                                {!caseId && (
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/cases/${draft.caseId}`}>
                                                            <ExternalLink className="mr-2 h-4 w-4" /> Go to Case
                                                        </Link>
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600">
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
