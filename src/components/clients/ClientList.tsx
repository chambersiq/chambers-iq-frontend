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
import { Search, Filter, MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Client } from '@/types/client'
import { formatDate } from '@/lib/utils'

import { useAuth } from '@/hooks/api/useCompany'
import { useClients } from '@/hooks/api/useClients'

// ... imports
import { useRouter } from 'next/navigation'
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
import { toast } from "sonner"
import { useDeleteClient } from '@/hooks/api/useClients'

export function ClientList() {
    const router = useRouter()
    const { user } = useAuth()
    const { data: clients = [], isLoading, error } = useClients(user?.companyId || '')
    const deleteClientMutation = useDeleteClient(user?.companyId || '')

    const [searchTerm, setSearchTerm] = useState('')
    const [typeFilter, setTypeFilter] = useState<string>('all')
    const [statusFilter, setStatusFilter] = useState<string>('all')

    const [clientToDelete, setClientToDelete] = useState<string | null>(null)

    if (isLoading) return <div>Loading clients...</div>
    if (error) return <div>Error loading clients</div>

    // Filter clients
    const filteredClients = clients.filter(client => {
        const matchesSearch =
            (client.clientType === 'individual' ? client.fullName : client.companyName)
                ?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (client.clientType === 'individual' ? client.email : client.contactEmail)
                ?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesType = typeFilter === 'all' || client.clientType === typeFilter
        const matchesStatus = statusFilter === 'all' || client.status === statusFilter

        return matchesSearch && matchesType && matchesStatus
    })

    const handleDelete = async () => {
        if (!clientToDelete) return

        try {
            await deleteClientMutation.mutateAsync(clientToDelete)
            toast.success("Client deleted successfully")
        } catch (error) {
            toast.error("Failed to delete client")
            console.error(error)
        } finally {
            setClientToDelete(null)
        }
    }

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-1 items-center gap-2">
                    <div className="relative flex-1 md:max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search clients..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Client Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="individual">Individual</SelectItem>
                            <SelectItem value="company">Company</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Contact Info</TableHead>
                            <TableHead>Total Cases</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date Added</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredClients.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    No clients found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredClients.map((client) => (
                                <TableRow key={client.clientId}>
                                    <TableCell className="font-medium">
                                        {client.clientType === 'individual' ? client.fullName : client.companyName}
                                        {client.clientType === 'company' && (
                                            <div className="text-xs text-muted-foreground">
                                                Contact: {client.contactName}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize">
                                            {client.clientType}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-sm">
                                            <span>{client.clientType === 'individual' ? client.email : client.contactEmail}</span>
                                            <span className="text-muted-foreground">
                                                {client.clientType === 'individual' ? client.phone : client.contactPhone}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{client.totalCases}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={client.status === 'active' ? 'success' : 'secondary'}
                                            className="capitalize"
                                        >
                                            {client.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{formatDate(client.createdAt)}</TableCell>
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
                                                <DropdownMenuItem onClick={() => router.push(`/clients/${client.clientId}`)}>
                                                    <Eye className="mr-2 h-4 w-4" /> View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => router.push(`/clients/${client.clientId}/edit`)}>
                                                    <Edit className="mr-2 h-4 w-4" /> Edit Client
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-red-600"
                                                    onClick={() => setClientToDelete(client.clientId)}
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

            <AlertDialog open={!!clientToDelete} onOpenChange={() => setClientToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the client and all associated data.
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
