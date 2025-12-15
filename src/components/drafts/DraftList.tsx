'use client'

import { useState, useEffect } from 'react'
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
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { logger } from '@/lib/logger'

interface DraftListProps {
    caseId?: string
}

export function DraftList({ caseId }: DraftListProps) {
    const { user } = useAuth()
    const { data: drafts = [], isLoading, error } = useDrafts(user?.companyId || '', caseId)
    const { mutateAsync: deleteDraft } = useDeleteDraft(user?.companyId || '')

    const [draftToDelete, setDraftToDelete] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [caseFilter, setCaseFilter] = useState<string>('all')
    const [clientFilter, setClientFilter] = useState<string>('all')

    // Component lifecycle logging
    useEffect(() => {
        logger.logComponentMount('DraftList', { caseId, totalDrafts: drafts.length })
        return () => {
            logger.logComponentUnmount('DraftList')
        }
    }, [])

    // Log when drafts data changes
    useEffect(() => {
        if (drafts.length > 0) {
            logger.logUserAction('drafts_loaded', { count: drafts.length, caseId })
        }
    }, [drafts, caseId])

    const handleDelete = (draftId: string) => {
        logger.logButtonClick('delete_draft', 'DraftList', { draftId })
        setDraftToDelete(draftId)
    }

    const confirmDelete = async () => {
        if (!draftToDelete) return

        const draft = drafts.find(d => d.draftId === draftToDelete)
        logger.logDraftingAction('delete_draft_confirmed', draft?.draftId, draft?.caseId, {
            draftName: draft?.name,
            caseName: draft?.caseName
        })

        try {
            await deleteDraft(draftToDelete)
            logger.logDraftingAction('delete_draft_success', draft?.draftId, draft?.caseId)
            toast.success("Draft deleted successfully")
            setDraftToDelete(null)
        } catch (err) {
            logger.logError(err as Error, 'DraftList', { action: 'delete_draft', draftId: draftToDelete })
            console.error(err)
            toast.error("Failed to delete draft")
        }
    }

    const draftToDeleteName = drafts.find(d => d.draftId === draftToDelete)?.name

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

    // Get unique values for filters from ACTUAL data
    const uniqueCases = Array.from(new Set(drafts.map(d => JSON.stringify({ id: d.caseId, name: d.caseName || 'Unknown Case' }))))
        .map(s => JSON.parse(s))

    const uniqueClients = Array.from(new Set(drafts.map(d => JSON.stringify({ id: d.clientId, name: d.clientName || 'Unknown Client' }))))
        .map(s => JSON.parse(s))

    // Filter drafts
    const filteredDrafts = drafts.filter(d => {
        // If caseId prop is provided, the hook already filters by it, but good to double check?
        // Actually hook returns what backend gives. If caseId passed, backend filters.

        const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'all' || d.status === statusFilter
        const matchesCase = caseId ? true : (caseFilter === 'all' || d.caseId === caseFilter)
        // If client filter is selected, check clientId. 
        // Backend stores clientId. 
        const matchesClient = clientFilter === 'all' || d.clientId === clientFilter

        return matchesSearch && matchesStatus && matchesCase && matchesClient
    })

    return (
        <div className="space-y-4">
            <AlertDialog open={!!draftToDelete} onOpenChange={(open) => !open && setDraftToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Draft</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <span className="font-semibold text-foreground">"{draftToDeleteName}"</span>? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={confirmDelete}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Filters */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-1 items-center gap-2 flex-wrap">
                    <div className="relative flex-1 min-w-[200px] md:max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search drafts..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => {
                                const newValue = e.target.value
                                setSearchTerm(newValue)
                                logger.logFormSubmit('search_drafts', { searchTerm: newValue, caseId })
                            }}
                        />
                    </div>

                    {!caseId && (
                        <>
                            <Select value={caseFilter} onValueChange={(value) => {
                                setCaseFilter(value)
                                logger.logUserAction('filter_changed', { filterType: 'case', value, caseId })
                            }}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by Case" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Cases</SelectItem>
                                    {uniqueCases.map((c: any) => (
                                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={clientFilter} onValueChange={(value) => {
                                setClientFilter(value)
                                logger.logUserAction('filter_changed', { filterType: 'client', value, caseId })
                            }}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by Client" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Clients</SelectItem>
                                    {uniqueClients.map((c: any) => (
                                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </>
                    )}

                    <Select value={statusFilter} onValueChange={(value) => {
                        setStatusFilter(value)
                        logger.logUserAction('filter_changed', { filterType: 'status', value, caseId })
                    }}>
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
                                <TableRow key={draft.draftId}>
                                    <TableCell className="font-medium">
                                        <Link href={`/drafts/${draft.draftId}`} className="hover:underline text-blue-600 flex items-center gap-2">
                                            <Edit3 className="h-4 w-4" />
                                            {draft.name}
                                        </Link>
                                    </TableCell>
                                    {!caseId && (
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span>{draft.caseName || 'Unknown Case'}</span>
                                                <span className="text-xs text-muted-foreground">{draft.clientName || 'Unknown Client'}</span>
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
