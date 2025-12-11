'use client'

import { useAuth } from '@/hooks/useAuth'
import { useClient } from '@/hooks/api/useClients'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Mail, Phone, MapPin, Building, Calendar, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatDate } from '@/lib/utils'

export default function ClientDetailsPage({ params }: { params: { id: string } }) {
    const { user } = useAuth()
    const router = useRouter()
    const clientId = params.id
    const { data: client, isLoading, error } = useClient(user?.companyId || '', clientId)

    if (isLoading) return <div className="p-6">Loading...</div>
    if (error || !client) return <div className="p-6">Client not found</div>

    const isCompany = client.clientType === 'company'

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        {isCompany ? client.companyName : client.fullName}
                    </h1>
                    <div className="flex items-center gap-2 mt-2 text-slate-600">
                        <Badge variant="outline" className="capitalize">
                            {client.clientType}
                        </Badge>
                        <span>•</span>
                        <span className="text-sm">Added on {formatDate(client.createdAt)}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => router.push(`/clients/${clientId}/edit`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </Button>
                    {/* Delete logic handled in list for now, or add here if needed */}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Main Info */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div className="flex items-start gap-3">
                                <Mail className="h-5 w-5 text-slate-500 mt-0.5" />
                                <div>
                                    <div className="font-semibold">Email</div>
                                    <div className="text-sm text-slate-600">
                                        {isCompany ? client.contactEmail : client.email}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="h-5 w-5 text-slate-500 mt-0.5" />
                                <div>
                                    <div className="font-semibold">Phone</div>
                                    <div className="text-sm text-slate-600">
                                        {isCompany ? client.contactPhone : client.phone}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-slate-500 mt-0.5" />
                                <div>
                                    <div className="font-semibold">Address</div>
                                    <div className="text-sm text-slate-600 whitespace-pre-line">
                                        {client.streetAddress}<br />
                                        {client.city}, {client.state} {client.pincode}
                                    </div>
                                </div>
                            </div>
                            {isCompany && (
                                <div className="flex items-start gap-3">
                                    <User className="h-5 w-5 text-slate-500 mt-0.5" />
                                    <div>
                                        <div className="font-semibold">Primary Contact</div>
                                        <div className="text-sm text-slate-600">
                                            {client.contactName} ({client.contactTitle})
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Tabs defaultValue="cases">
                        <TabsList>
                            <TabsTrigger value="cases">Active Cases</TabsTrigger>
                            <TabsTrigger value="notes">Notes</TabsTrigger>
                        </TabsList>
                        <TabsContent value="cases" className="mt-4">
                            <Card>
                                <CardContent className="p-6">
                                    <p className="text-sm text-slate-500">
                                        Case list integration coming soon. Use the Cases tab to view all cases.
                                    </p>
                                    <div className="mt-4">
                                        <Link href={`/cases?client=${clientId}`}>
                                            <Button variant="link" className="px-0">
                                                View cases for this client &rarr;
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="notes" className="mt-4">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="whitespace-pre-wrap text-sm text-slate-700">
                                        {client.notes || "No notes available."}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center pb-2 border-b">
                                <span className="text-sm text-slate-500">Status</span>
                                <Badge variant={client.status === 'active' ? 'success' : 'secondary'}>
                                    {client.status}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b">
                                <span className="text-sm text-slate-500">Total Cases</span>
                                <span className="font-semibold">{client.totalCases || 0}</span>
                            </div>
                            {isCompany && (
                                <>
                                    <div className="flex justify-between items-center pb-2 border-b">
                                        <span className="text-sm text-slate-500">Industry</span>
                                        <span className="font-semibold capitalize">{client.industry || '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-2 border-b">
                                        <span className="text-sm text-slate-500">Company Type</span>
                                        <span className="font-semibold capitalize">{client.companyType || '-'}</span>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
