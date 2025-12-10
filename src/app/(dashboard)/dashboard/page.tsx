"use client"

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
    Trash2,
} from 'lucide-react'

import { useAuth } from '@/hooks/api/useCompany'
import { useDashboardStats } from '@/hooks/api/useDashboard'
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardPage() {
    const { user } = useAuth()
    const { data: stats, isLoading } = useDashboardStats(user?.companyId || '')

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
                        {isLoading ? (
                            <div className="space-y-2">
                                <Skeleton className="h-8 w-16" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                        ) : (
                            <>
                                <div className="text-2xl font-bold">{stats?.activeClients || 0}</div>
                                <p className="text-xs text-slate-500">+{stats?.newClientsThisMonth || 0} from last month</p>
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
                        <Briefcase className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-2">
                                <Skeleton className="h-8 w-16" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                        ) : (
                            <>
                                <div className="text-2xl font-bold">{stats?.activeCases || 0}</div>
                                <p className="text-xs text-slate-500">+{stats?.newCasesThisWeek || 0} new this week</p>
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Documents Processed</CardTitle>
                        <FileText className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-2">
                                <Skeleton className="h-8 w-16" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                        ) : (
                            <>
                                <div className="text-2xl font-bold">{stats?.documentsProcessed || 0}</div>
                                <p className="text-xs text-slate-500">+{stats?.newDocumentsThisWeek || 0} this week</p>
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">AI Drafts Created</CardTitle>
                        <Edit3 className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-2">
                                <Skeleton className="h-8 w-16" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                        ) : (
                            <>
                                <div className="text-2xl font-bold">{stats?.aiDraftsCreated || 0}</div>
                                <p className="text-xs text-slate-500">+{stats?.newDraftsThisWeek || 0} this week</p>
                            </>
                        )}
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
                            {isLoading ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            ) : stats?.upcomingDeadlines && stats.upcomingDeadlines.length > 0 ? (
                                stats.upcomingDeadlines.map((deadline) => {
                                    const deadlineDate = new Date(deadline.date);
                                    const isOverdue = deadlineDate < new Date();
                                    const dayDiff = Math.ceil((deadlineDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));

                                    return (
                                        <div key={deadline.id} className={`flex items-start gap-3 rounded-lg border p-3 ${isOverdue ? 'border-red-200 bg-red-50' : 'border-slate-200'
                                            }`}>
                                            <AlertCircle className={`h-5 w-5 mt-0.5 ${isOverdue || deadline.type === 'statute' ? 'text-red-600' :
                                                deadline.type === 'discovery' ? 'text-orange-600' :
                                                    'text-blue-600'
                                                }`} />
                                            <div className="flex-1">
                                                <div className="font-semibold text-sm">{deadline.title}</div>
                                                <div className={`text-xs ${isOverdue ? 'text-red-700' : 'text-slate-600'}`}>
                                                    {isOverdue
                                                        ? `Overdue by ${Math.abs(dayDiff)} days`
                                                        : `Due in ${dayDiff} days`} • {new Date(deadline.date).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <p className="text-sm text-slate-500">No upcoming deadlines.</p>
                            )}
                        </div>
                        <Button variant="link" className="mt-4 w-full" asChild>
                            <Link href="/cases">View All Deadlines →</Link>
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
                            {isLoading ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            ) : stats?.recentActivity && stats.recentActivity.length > 0 ? (
                                stats.recentActivity.slice(0, 5).map((activity) => (
                                    <div key={activity.id} className="flex items-start gap-3">
                                        <div className={`rounded-full p-2 ${activity.title.includes('Deleted') ? 'bg-red-100' :
                                            activity.type === 'client' ? 'bg-orange-100' :
                                                activity.type === 'case' ? 'bg-purple-100' :
                                                    activity.type === 'draft' ? 'bg-green-100' :
                                                        'bg-blue-100'
                                            }`}>
                                            {activity.title.includes('Deleted') ? <Trash2 className="h-4 w-4 text-red-600" /> :
                                                activity.type === 'client' ? <Users className="h-4 w-4 text-orange-600" /> :
                                                    activity.type === 'case' ? <Briefcase className="h-4 w-4 text-purple-600" /> :
                                                        activity.type === 'draft' ? <Edit3 className="h-4 w-4 text-green-600" /> :
                                                            <FileText className="h-4 w-4 text-blue-600" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-semibold">{activity.title}</div>
                                            <div className="text-xs text-slate-500">
                                                {activity.subtitle} • {new Date(activity.date).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500">No recent activity.</p>
                            )}
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
