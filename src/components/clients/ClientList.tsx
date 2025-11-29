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

// Mock data for demonstration
const MOCK_CLIENTS: Client[] = [
    {
        id: '1',
        clientType: 'individual',
        fullName: 'John Smith',
        email: 'john.smith@example.com',
        phone: '(555) 123-4567',
        status: 'active',
        totalCases: 2,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: '2',
        clientType: 'company',
        companyName: 'Acme Corp',
        contactName: 'Jane Doe',
        contactEmail: 'jane@acmecorp.com',
        contactPhone: '(555) 987-6543',
        status: 'active',
        totalCases: 5,
        createdAt: '2023-11-20T14:30:00Z',
        updatedAt: '2024-01-10T09:15:00Z'
    },
    {
        id: '3',
        clientType: 'individual',
        fullName: 'Robert Johnson',
        email: 'bob.j@example.com',
        phone: '(555) 555-5555',
        status: 'inactive',
        totalCases: 0,
        createdAt: '2023-12-05T11:20:00Z',
        updatedAt: '2023-12-05T11:20:00Z'
    }
]

export function ClientList() {
    const [searchTerm, setSearchTerm] = useState('')
    const [typeFilter, setTypeFilter] = useState<string>('all')
    const [statusFilter, setStatusFilter] = useState<string>('all')

    // Filter clients
    const filteredClients = MOCK_CLIENTS.filter(client => {
        const matchesSearch =
            (client.clientType === 'individual' ? client.fullName : client.companyName)
                .toLowerCase().includes(searchTerm.toLowerCase()) ||
            (client.clientType === 'individual' ? client.email : client.contactEmail)
                .toLowerCase().includes(searchTerm.toLowerCase())

        const matchesType = typeFilter === 'all' || client.clientType === typeFilter
        const matchesStatus = statusFilter === 'all' || client.status === statusFilter

        return matchesSearch && matchesType && matchesStatus
    })

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
                                <TableRow key={client.id}>
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
                                                <DropdownMenuItem>
                                                    <Eye className="mr-2 h-4 w-4" /> View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Edit className="mr-2 h-4 w-4" /> Edit Client
                                                </DropdownMenuItem>
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
