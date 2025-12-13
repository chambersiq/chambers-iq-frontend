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
import { Edit3, MoreHorizontal, Trash2, ExternalLink, Search } from 'lucide-react'
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
import { formatDate, formatTimeAgo } from '@/lib/utils'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useDrafts, useDeleteDraft } from '@/hooks/api/useDrafts'
import { useClients } from '@/hooks/api/useClients'
import { useCases } from '@/hooks/api/useCases'
import { useMasterData } from '@/contexts/MasterDataContext'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'

interface DraftListProps {
    caseId?: string
}

export function DraftList({ caseId }: DraftListProps) {
    const { user } = useAuth()
    const { data: drafts = [], isLoading, error } = useDrafts(user?.companyId || '', caseId)
    const { mutateAsync: deleteDraft } = useDeleteDraft(user?.companyId || '')

    const handleDelete = async (draftId: string) => {
        if (!window.confirm("Are you sure you want to delete this draft?")) return
        try {
            await deleteDraft(draftId)
            toast.success("Draft deleted")
        } catch (err) {
            console.error(err)
            toast.error("Failed to delete draft")
        }
    }

    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [caseFilter, setCaseFilter] = useState<string>('all')
    const [clientFilter, setClientFilter] = useState<string>('all')
    const [docTypeFilter, setDocTypeFilter] = useState<string>('all')

    // Data Hooks for Filters
    const { data: clients = [] } = useClients(user?.companyId || '')
    // Only fetch cases for selected client if one is selected, else fetch all (if supported) or filtered in memory
    // Currently useCases takes (companyId, clientId). If clientId is '', it fetches all? Let's assume yes or check hook.
    // actually useCases(companyId, clientId) usually fetches for that client. If clientId is empty, maybe all?
    // Let's assume we want dependent dropdowns.
    const { data: cases = [] } = useCases(user?.companyId || '', clientFilter !== 'all' ? clientFilter : undefined)
    const { data: masterData } = useMasterData()

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex justify-between gap-4">
                    <Skeleton className="h-10 w-[200px]" />
                    <Skeleton className="h-10 w-[150px]" />
                    <Skeleton className="h-10 w-[150px]" />
                </div>
                <div className="rounded-md border bg-white p-4 space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
        )
    }

    if (error) {
        return <div className="text-red-500">Error loading drafts</div>
    }

    // Filter drafts
    const filteredDrafts = drafts.filter(d => {
        const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'all' || d.status === statusFilter
        const matchesCase = caseId ? true : (caseFilter === 'all' || d.caseId === caseFilter)
        const matchesClient = clientFilter === 'all' || d.clientId === clientFilter
        const matchesDocType = docTypeFilter === 'all' || d.documentTypeId === docTypeFilter

        return matchesSearch && matchesStatus && matchesCase && matchesClient && matchesDocType
    })

    // Helper to get Doc Type Name
    const getDocTypeName = (id?: string) => {
        if (!id || !masterData) return 'General'
        const type = masterData.document_types.find(t => t.id === id)
        return type ? type.name : 'General'
    }

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
                            {/* Client Filter (Primary) */}
                            <Select value={clientFilter} onValueChange={(val) => {
                                setClientFilter(val)
                                setCaseFilter('all') // Reset case filter when client changes
                            }}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by Client" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Clients</SelectItem>
                                    {clients.map(c => (
                                        <SelectItem key={c.clientId} value={c.clientId}>
                                            {c.clientType === 'individual' ? c.fullName : c.companyName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Case Filter (Dependent) */}
                            <Select value={caseFilter} onValueChange={setCaseFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by Case" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Cases</SelectItem>
                                    {cases.map(c => (
                                        <SelectItem key={c.caseId} value={c.caseId}>{c.caseName}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </>
                    )}

                    {/* Document Type Filter */}
                    {masterData && (
                        <Select value={docTypeFilter} onValueChange={setDocTypeFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Doc Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                {masterData.document_types.map(t => (
                                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
                            <TableHead>Reference</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Last Edited</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredDrafts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No drafts found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredDrafts.map((draft) => (
                                <TableRow key={draft.draftId}>
                                    <TableCell className="font-medium">
                                        <Link href={`/drafts/${draft.draftId}`} className="hover:underline text-blue-600 flex items-center gap-2">
                                            <Edit3 className="h-4 w-4" />
                                            {draft.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-slate-700">{draft.clientName || 'Unknown Client'}</span>
                                            <span className="text-xs text-muted-foreground">{draft.caseName || 'Unknown Case'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="font-normal text-slate-600">
                                            {getDocTypeName(draft.documentTypeId)}
                                        </Badge>
                                    </TableCell>
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
                                                    <Link href={`/drafts/${draft.draftId}`}>
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
                                                <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer" onClick={() => handleDelete(draft.draftId)}>
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
