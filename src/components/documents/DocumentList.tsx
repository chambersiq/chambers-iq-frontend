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
import { FileText, MoreHorizontal, Eye, Download, Trash2, Sparkles } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Document, DocumentType } from '@/types/document'
import { formatDate } from '@/lib/utils'

// Mock data - Updated with Indian Law Categorization
const MOCK_DOCS: Document[] = [
    {
        documentId: '1',
        caseId: '1',
        name: 'Complaint.pdf',
        type: 'pleading',
        fileSize: 1024 * 1024 * 2.5, // 2.5MB
        mimeType: 'application/pdf',
        url: '#',
        aiStatus: 'completed',
        aiConfidence: 0.95,
        uploadedBy: 'John Doe',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        // Required Indian Law Categorization
        documentTypeId: 'DT_001', // Plaint
        documentCategoryId: 'DCAT_01', // Pleadings
        courtLevelId: 'CL_DC', // District Court
        status: 'draft',
        parentCaseTypeId: 'CT_CIV_01' // Civil Suit
    },
    {
        documentId: '2',
        caseId: '1',
        name: 'Contract_Agreement.pdf',
        type: 'contract',
        fileSize: 1024 * 500, // 500KB
        mimeType: 'application/pdf',
        url: '#',
        aiStatus: 'completed',
        aiConfidence: 0.88,
        uploadedBy: 'John Doe',
        createdAt: '2024-01-16T14:30:00Z',
        updatedAt: '2024-01-16T14:30:00Z',
        // Required Indian Law Categorization
        documentTypeId: 'DT_017', // Settlement Agreement
        documentCategoryId: 'DCAT_06', // Contracts & Agreements
        courtLevelId: 'CL_HC', // High Court
        status: 'draft',
        parentCaseTypeId: 'CT_CIV_01' // Civil Suit
    },
    {
        documentId: '3',
        caseId: '1',
        name: 'Email_Thread_Jan2024.pdf',
        type: 'evidence',
        fileSize: 1024 * 1024 * 1.2, // 1.2MB
        mimeType: 'application/pdf',
        url: '#',
        aiStatus: 'processing',
        uploadedBy: 'Jane Smith',
        createdAt: '2024-01-20T09:15:00Z',
        updatedAt: '2024-01-20T09:15:00Z',
        // Required Indian Law Categorization
        documentTypeId: 'DT_010', // Evidence Affidavit
        documentCategoryId: 'DCAT_03', // Evidence & Affidavits
        courtLevelId: 'CL_DC', // District Court
        status: 'draft',
        parentCaseTypeId: 'CT_CIV_01' // Civil Suit
    }
]

const TYPE_COLORS: Record<DocumentType, string> = {
    'pleading': 'default',
    'motion': 'destructive',
    'order': 'default',
    'contract': 'secondary',
    'evidence': 'warning',
    'discovery': 'secondary',
    'correspondence': 'outline',
    'invoice': 'success',
    'other': 'outline'
}

export function DocumentList() {
    return (
        <div className="rounded-md border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>AI Status</TableHead>
                        <TableHead>Uploaded</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {MOCK_DOCS.map((doc) => (
                        <TableRow key={doc.documentId}>
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-blue-500" />
                                    {doc.name}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={TYPE_COLORS[doc.type] as any} className="capitalize">
                                    {doc.type}
                                </Badge>
                            </TableCell>
                            <TableCell>{(doc.fileSize / 1024 / 1024).toFixed(2)} MB</TableCell>
                            <TableCell>
                                {doc.aiStatus === 'completed' ? (
                                    <Badge variant="success" className="gap-1">
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
                                <div className="text-[10px]">by {doc.uploadedBy}</div>
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
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
