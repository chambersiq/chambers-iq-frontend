'use client'

import { ClientForm } from '@/components/clients/ClientForm'
import { useAuth } from '@/hooks/api/useCompany'
import { useClient } from '@/hooks/api/useClients'
import { Skeleton } from '@/components/ui/skeleton'

export default function EditClientPage({ params }: { params: { id: string } }) {
    const { user } = useAuth()
    const clientId = params.id
    const { data: client, isLoading, error } = useClient(user?.companyId || '', clientId)

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-[400px] w-full" />
            </div>
        )
    }

    if (error || !client) {
        return <div>Error loading client.</div>
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Edit Client</h1>
                <p className="mt-2 text-slate-600">
                    Update client information.
                </p>
            </div>

            <ClientForm initialData={client} clientId={clientId} />
        </div>
    )
}
