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
import { Search, MoreHorizontal, Edit, Copy, Trash2, FileType } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { TemplateCategory } from '@/types/template'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { useTemplates } from '@/hooks/api/useTemplates'
import { useAuth } from '@/hooks/api/useCompany'

const CATEGORY_COLORS: Record<TemplateCategory, string> = {
    'contract': 'default',
    'pleading': 'destructive',
    'motion': 'destructive',
    'letter': 'outline',
    'discovery': 'secondary',
    'other': 'secondary'
}

export function TemplateList() {
    const { user } = useAuth()
    const companyId = user?.companyId || ''
    const { data: templates = [], isLoading } = useTemplates(companyId)

    const [searchTerm, setSearchTerm] = useState('')
    const [categoryFilter, setCategoryFilter] = useState<string>('all')

    const filteredTemplates = templates.filter(t => {
        const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter
        return matchesSearch && matchesCategory
    })

    if (isLoading) {
        return <div className="p-8 text-center text-slate-500">Loading templates...</div>
    }

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-1 items-center gap-2">
                    <div className="relative flex-1 md:max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search templates..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="contract">Contracts</SelectItem>
                            <SelectItem value="motion">Motions</SelectItem>
                            <SelectItem value="pleading">Pleadings</SelectItem>
                            <SelectItem value="letter">Letters</SelectItem>
                            <SelectItem value="discovery">Discovery</SelectItem>
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
                            <TableHead>Category</TableHead>
                            <TableHead>Last Updated</TableHead>
                            <TableHead>Created By</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTemplates.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No templates found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredTemplates.map((t) => (
                                <TableRow key={t.templateId}>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <Link href={`/templates/${t.templateId}`} className="hover:underline text-blue-600 flex items-center gap-2">
                                                <FileType className="h-4 w-4" />
                                                {t.name}
                                            </Link>
                                            <span className="text-xs text-muted-foreground">{t.description}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={CATEGORY_COLORS[t.category] as any} className="capitalize">
                                            {t.category}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {formatDate(t.updatedAt)}
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {t.isSystem ? <Badge variant="secondary">System</Badge> : t.createdBy}
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
                                                    <Link href={`/templates/${t.templateId}`}>
                                                        <Edit className="mr-2 h-4 w-4" /> Edit Template
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Copy className="mr-2 h-4 w-4" /> Duplicate
                                                </DropdownMenuItem>
                                                {!t.isSystem && (
                                                    <>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-red-600">
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </>
                                                )}
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
