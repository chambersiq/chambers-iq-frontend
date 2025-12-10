import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth, useCompany } from '@/hooks/api/useCompany'
import { Skeleton } from '@/components/ui/skeleton'

export function CompanyProfile() {
    const { user } = useAuth()
    const { data: company, isLoading, error } = useCompany(user?.companyId || '')

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-[200px]" />
                    <Skeleton className="h-4 w-[300px]" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-20 w-full" />
                </CardContent>
            </Card>
        )
    }

    if (error || !company) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <p className="text-red-500">Failed to load company details.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Company Profile</CardTitle>
                <CardDescription>View and manage your firm's details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-500">Company Name</label>
                        <div className="text-base font-medium text-slate-900">{company.name}</div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-500 block">Company ID</label>
                        <div className="font-mono text-sm bg-slate-50 px-2 py-1 rounded inline-block text-slate-700">
                            {company.companyId}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-500">Email Address</label>
                        <div className="text-base text-slate-900">{company.email}</div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-500">Status</label>
                        <div className="flex items-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                ${company.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                                {company.status}
                            </span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-500">Phone Number</label>
                        <div className="text-base text-slate-900">{company.phone || '-'}</div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-500">Created At</label>
                        <div className="text-base text-slate-900">
                            {company.createdAt ? new Date(company.createdAt).toLocaleDateString() : '-'}
                        </div>
                    </div>
                    <div className="col-span-2 space-y-1">
                        <label className="text-sm font-medium text-slate-500">Address</label>
                        <div className="text-base text-slate-900 bg-slate-50 p-3 rounded-md border border-slate-100">
                            {company.address || 'No address provided'}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
