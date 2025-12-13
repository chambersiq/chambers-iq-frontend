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
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { useTemplates, useDeleteTemplate } from '@/hooks/api/useTemplates'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'
import { useMasterData } from '@/contexts/MasterDataContext'
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

function DescriptionCell({ description }: { description: string }) {
    const [isExpanded, setIsExpanded] = useState(false)
    const maxLength = 60

    if (!description) return <span className="text-muted-foreground">-</span>

    if (description.length <= maxLength) return <span>{description}</span>

    return (
        <div className="max-w-[300px]">
            <span>{isExpanded ? description : `${description.slice(0, maxLength)}...`}</span>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="ml-2 text-xs font-medium text-blue-600 hover:text-blue-800"
            >
                {isExpanded ? 'Show Less' : 'Show More'}
            </button>
        </div>
    )
}

export function TemplateList() {
    const { user } = useAuth()
    const companyId = user?.companyId || ''
    const { data: templates = [], isLoading } = useTemplates(companyId)
    const { data: masterData } = useMasterData()
    const deleteTemplate = useDeleteTemplate(companyId)

    const [searchTerm, setSearchTerm] = useState('')
    const [documentTypeFilter, setDocumentTypeFilter] = useState<string>('all')
    const [templateToDelete, setTemplateToDelete] = useState<string | null>(null)

    const filteredTemplates = templates.filter(t => {
        const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesDocumentType = documentTypeFilter === 'all' || t.documentTypeId === documentTypeFilter
        return matchesSearch && matchesDocumentType
    })

    const handleDelete = async (templateId: string) => {
        try {
            await deleteTemplate.mutateAsync(templateId)
            toast.success('Template deleted successfully')
            setTemplateToDelete(null)
        } catch (error) {
            console.error('Failed to delete template', error)
            toast.error('Failed to delete template')
        }
    }

    if (isLoading) {
        return <div className="p-8 text-center text-slate-500">Loading templates...</div>
    }

    const templateToDeleteName = templates.find(t => t.templateId === templateToDelete)?.name

    return (
        <div className="space-y-4">
            <AlertDialog open={!!templateToDelete} onOpenChange={(open) => !open && setTemplateToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Template</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <span className="font-semibold text-foreground">"{templateToDeleteName}"</span>? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => templateToDelete && handleDelete(templateToDelete)}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

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
                    <Select value={documentTypeFilter} onValueChange={setDocumentTypeFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Document Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Document Types</SelectItem>
                            {masterData?.document_types.map(dt => (
                                <SelectItem key={dt.id} value={dt.id}>
                                    {dt.name}
                                </SelectItem>
                            ))}
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
                            <TableHead>Document Type</TableHead>
                            <TableHead>Court Level</TableHead>
                            <TableHead>Case Type</TableHead>
                            <TableHead className="w-[200px]">Description</TableHead>
                            <TableHead>Last Updated</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTemplates.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
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
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {t.documentTypeId ? (
                                            <Badge variant="outline">
                                                {masterData?.document_types.find(dt => dt.id === t.documentTypeId)?.name || t.documentTypeId}
                                            </Badge>
                                        ) : (
                                            <span className="text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {t.courtLevelId ? (
                                            <Badge variant="secondary">
                                                {masterData?.court_levels.find(cl => cl.id === t.courtLevelId)?.name || t.courtLevelId}
                                            </Badge>
                                        ) : (
                                            <span className="text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {t.caseTypeId ? (
                                            <Badge variant="secondary">
                                                {masterData?.case_types.find(ct => ct.id === t.caseTypeId)?.name || t.caseTypeId}
                                            </Badge>
                                        ) : (
                                            <span className="text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        <DescriptionCell description={t.description} />
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {formatDate(t.updatedAt)}
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
                                                        <DropdownMenuItem
                                                            className="text-red-600 cursor-pointer"
                                                            onClick={() => setTemplateToDelete(t.templateId)}
                                                        >
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
