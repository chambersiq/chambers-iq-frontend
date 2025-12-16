'use client'

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
import { FileText, MoreHorizontal, Eye, Download, Trash2, Sparkles, Loader2 } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Document } from '@/types/document'
import { formatDate } from '@/lib/utils'
import { useMasterData } from '@/contexts/MasterDataContext'
import { useDocuments } from '@/hooks/api/useDocuments'

interface DocumentListProps {
    companyId: string
    caseId: string
}

export function DocumentList({ companyId, caseId }: DocumentListProps) {
    const { data: masterData } = useMasterData()
    const { data: documents = [], isLoading, error } = useDocuments(companyId, caseId)

    // Resolve document category names
    const resolveDocumentCategory = (documentTypeId: string): string => {
        if (!masterData) return documentTypeId

        // Check supporting documents first
        for (const category of masterData.supporting_document_categories || []) {
            const subcategory = category.subcategories.find(sub => sub.id === documentTypeId)
            if (subcategory) {
                return `${category.name} - ${subcategory.name}`
            }
        }

        // Check legal documents
        const legalDoc = masterData.document_types?.find(dt => dt.id === documentTypeId)
        if (legalDoc) {
            return legalDoc.name
        }

        return documentTypeId // Fallback
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                Loading documents...
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-8 text-red-600">
                Error loading documents: {error.message}
            </div>
        )
    }

    if (documents.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                No documents found for this case.
            </div>
        )
    }
    return (
        <div className="rounded-md border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Main Category</TableHead>
                        <TableHead>Subcategory</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>AI Status</TableHead>
                        <TableHead>Uploaded</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {documents.map((doc) => {
                        const fullCategory = resolveDocumentCategory(doc.documentTypeId)
                        const mainCategory = fullCategory.split(' - ')[0]
                        const subcategory = fullCategory.split(' - ').slice(1).join(' - ') || fullCategory

                        return (
                            <TableRow key={doc.documentId}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-blue-500" />
                                        {doc.name}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="text-xs">
                                        {mainCategory}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="text-xs">
                                        {subcategory}
                                    </Badge>
                                </TableCell>
                                <TableCell>{(doc.fileSize / 1024 / 1024).toFixed(2)} MB</TableCell>
                                <TableCell>
                                    {doc.aiStatus === 'completed' ? (
                                        <Badge variant="default" className="gap-1 bg-green-100 text-green-800">
                                            <Sparkles className="h-3 w-3" /> Analyzed
                                        </Badge>
                                    ) : doc.aiStatus === 'processing' ? (
                                        <Badge variant="secondary" className="animate-pulse">
                                            Processing...
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline">Pending</Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-muted-foreground text-xs">
                                    {formatDate(doc.createdAt)}
                                    <div className="text-[10px]">ID: {doc.documentId}</div>
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
                                            <DropdownMenuItem>
                                                <Eye className="mr-2 h-4 w-4" /> View & Analyze
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Download className="mr-2 h-4 w-4" /> Download
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-600">
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}
