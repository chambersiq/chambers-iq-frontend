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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Search, MoreHorizontal, Eye, Edit, Trash2, AlertCircle } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Case, CaseStatus, CasePriority } from '@/types/case'
import { formatDate, formatTimeAgo } from '@/lib/utils'
import Link from 'next/link'
import { useCases, useDeleteCase } from '@/hooks/api/useCases'
import { useAuth } from '@/hooks/api/useCompany'
import { useClients } from '@/hooks/api/useClients'
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
import { toast } from 'sonner'

const STATUS_COLORS: Record<CaseStatus, string> = {
    'draft': 'secondary',
    'active': 'success',
    'discovery': 'default',
    'motion-practice': 'default',
    'trial': 'destructive',
    'settlement': 'success',
    'closed': 'secondary',
    'on-hold': 'warning'
}

const PRIORITY_COLORS: Record<CasePriority, string> = {
    'low': 'secondary',
    'medium': 'default',
    'high': 'warning',
    'urgent': 'destructive'
}

export function CaseList() {
    const { user } = useAuth()
    const companyId = user?.companyId || ''

    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [priorityFilter, setPriorityFilter] = useState<string>('all')
    const [clientFilter, setClientFilter] = useState<string>('all')

    // Delete state
    const [caseToDelete, setCaseToDelete] = useState<Case | null>(null)

    const { data: cases = [], isLoading } = useCases(companyId, clientFilter === 'all' ? undefined : clientFilter)
    const { data: clients = [] } = useClients(companyId)
    const deleteCase = useDeleteCase(companyId)

    const handleDelete = () => {
        if (!caseToDelete) return

        deleteCase.mutate({ clientId: caseToDelete.clientId, caseId: caseToDelete.caseId }, {
            onSuccess: () => {
                toast.success("Case deleted successfully")
                setCaseToDelete(null)
            },
            onError: (error) => {
                toast.error("Failed to delete case")
                console.error(error)
            }
        })
    }

    const filteredCases = cases.filter(c => {
        const matchesSearch =
            c.caseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.clientName || '').toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === 'all' || c.status === statusFilter
        const matchesPriority = priorityFilter === 'all' || c.priority === priorityFilter

        return matchesSearch && matchesStatus && matchesPriority
    })

    if (isLoading) {
        return <div>Loading cases...</div>
    }

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-1 items-center gap-2">
                    <div className="relative flex-1 md:max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search cases..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select value={clientFilter} onValueChange={setClientFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by Client" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Clients</SelectItem>
                            {clients.map((client) => {
                                const label = client.clientType === 'individual'
                                    ? client.fullName
                                    : client.companyName;
                                return (
                                    <SelectItem key={client.id} value={client.id}>
                                        {label}
                                    </SelectItem>
                                )
                            })}
                        </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="discovery">Discovery</SelectItem>
                            <SelectItem value="trial">Trial</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Priority</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Case Number</TableHead>
                            <TableHead>Case Name</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Last Updated</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCases.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center">
                                    No cases found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredCases.map((c) => (
                                <TableRow key={c.caseId}>
                                    <TableCell className="font-mono text-xs">{c.caseNumber}</TableCell>
                                    <TableCell className="font-medium">
                                        <Link href={`/cases/${c.caseId}`} className="hover:underline text-blue-600">
                                            {c.caseName}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{c.clientName}</TableCell>
                                    <TableCell className="capitalize">
                                        {c.caseType.replace('-', ' ')}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={PRIORITY_COLORS[c.priority] as any} className="capitalize">
                                            {c.priority}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={STATUS_COLORS[c.status] as any} className="capitalize">
                                            {c.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-xs">
                                        {formatTimeAgo(c.updatedAt)}
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
                                                    <Link href={`/cases/${c.caseId}`}>
                                                        <Eye className="mr-2 h-4 w-4" /> View Dashboard
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/cases/${c.caseId}/edit`}>
                                                        <Edit className="mr-2 h-4 w-4" /> Edit Case
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-red-600 cursor-pointer"
                                                    onClick={() => setCaseToDelete(c)}
                                                >
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

            <AlertDialog open={!!caseToDelete} onOpenChange={(open) => !open && setCaseToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the case
                            "{caseToDelete?.caseName}" and all associated data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
