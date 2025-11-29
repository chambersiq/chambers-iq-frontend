import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Users,
    Briefcase,
    FileText,
    FileType,
    Edit3,
    TrendingUp,
    Calendar,
    AlertCircle,
    CheckCircle2,
} from 'lucide-react'

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="mt-2 text-slate-600">
                    Welcome back! Here's an overview of your legal practice.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
                        <Users className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">127</div>
                        <p className="text-xs text-slate-500">+12% from last month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
                        <Briefcase className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">43</div>
                        <p className="text-xs text-slate-500">+3 new this week</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Documents Processed</CardTitle>
                        <FileText className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,247</div>
                        <p className="text-xs text-slate-500">+89 this week</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">AI Drafts Created</CardTitle>
                        <Edit3 className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">34</div>
                        <p className="text-xs text-slate-500">+15 this week</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Get started with common tasks</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Link href="/clients/new">
                        <Button variant="outline" className="h-auto w-full flex-col items-start gap-2 p-4">
                            <Users className="h-6 w-6 text-blue-600" />
                            <div className="text-left">
                                <div className="font-semibold">Add New Client</div>
                                <div className="text-xs text-slate-500">Individual or Company</div>
                            </div>
                        </Button>
                    </Link>

                    <Link href="/cases/new">
                        <Button variant="outline" className="h-auto w-full flex-col items-start gap-2 p-4">
                            <Briefcase className="h-6 w-6 text-blue-600" />
                            <div className="text-left">
                                <div className="font-semibold">Create New Case</div>
                                <div className="text-xs text-slate-500">Start a new legal matter</div>
                            </div>
                        </Button>
                    </Link>

                    <Link href="/documents">
                        <Button variant="outline" className="h-auto w-full flex-col items-start gap-2 p-4">
                            <FileText className="h-6 w-6 text-blue-600" />
                            <div className="text-left">
                                <div className="font-semibold">Upload Document</div>
                                <div className="text-xs text-slate-500">AI-powered analysis</div>
                            </div>
                        </Button>
                    </Link>

                    <Link href="/templates">
                        <Button variant="outline" className="h-auto w-full flex-col items-start gap-2 p-4">
                            <FileType className="h-6 w-6 text-blue-600" />
                            <div className="text-left">
                                <div className="font-semibold">Manage Templates</div>
                                <div className="text-xs text-slate-500">Create or edit templates</div>
                            </div>
                        </Button>
                    </Link>

                    <Link href="/drafts">
                        <Button variant="outline" className="h-auto w-full flex-col items-start gap-2 p-4">
                            <Edit3 className="h-6 w-6 text-blue-600" />
                            <div className="text-left">
                                <div className="font-semibold">AI Drafting</div>
                                <div className="text-xs text-slate-500">Generate legal documents</div>
                            </div>
                        </Button>
                    </Link>

                    <Link href="/cases">
                        <Button variant="outline" className="h-auto w-full flex-col items-start gap-2 p-4">
                            <TrendingUp className="h-6 w-6 text-blue-600" />
                            <div className="text-left">
                                <div className="font-semibold">View All Cases</div>
                                <div className="text-xs text-slate-500">Manage active and closed</div>
                            </div>
                        </Button>
                    </Link>
                </CardContent>
            </Card>

            {/* Two Column Layout */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Upcoming Deadlines */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Upcoming Deadlines
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3">
                                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                                <div className="flex-1">
                                    <div className="font-semibold text-sm">Statute of Limitations - Smith v. Jones</div>
                                    <div className="text-xs text-red-700">Due in 5 days • Jan 15, 2025</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 p-3">
                                <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                                <div className="flex-1">
                                    <div className="font-semibold text-sm">Discovery Cutoff - Johnson Case</div>
                                    <div className="text-xs text-orange-700">Due in 12 days • Jan 22, 2025</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-lg border border-slate-200 p-3">
                                <Calendar className="h-5 w-5 text-slate-600 mt-0.5" />
                                <div className="flex-1">
                                    <div className="font-semibold text-sm">Trial Date - Williams Matter</div>
                                    <div className="text-xs text-slate-600">Feb 10, 2025</div>
                                </div>
                            </div>
                        </div>
                        <Button variant="link" className="mt-4 w-full">
                            View All Deadlines →
                        </Button>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5" />
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="rounded-full bg-blue-100 p-2">
                                    <FileText className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-semibold">Document Analyzed</div>
                                    <div className="text-xs text-slate-500">Contract_Agreement.pdf • 2 hours ago</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="rounded-full bg-green-100 p-2">
                                    <Edit3 className="h-4 w-4 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-semibold">Draft Created</div>
                                    <div className="text-xs text-slate-500">Motion to Dismiss • 4 hours ago</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="rounded-full bg-purple-100 p-2">
                                    <Briefcase className="h-4 w-4 text-purple-600" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-semibold">Case Updated</div>
                                    <div className="text-xs text-slate-500">Anderson v. Tech Corp • Yesterday</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="rounded-full bg-orange-100 p-2">
                                    <Users className="h-4 w-4 text-orange-600" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-semibold">New Client Added</div>
                                    <div className="text-xs text-slate-500">Acme Corporation • 2 days ago</div>
                                </div>
                            </div>
                        </div>
                        <Button variant="link" className="mt-4 w-full">
                            View Full Activity Log →
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
