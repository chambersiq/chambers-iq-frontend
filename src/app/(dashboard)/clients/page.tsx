import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { ClientList } from '@/components/clients/ClientList'

export default function ClientsPage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Clients</h1>
                    <p className="mt-2 text-slate-600">
                        Manage individual and company clients
                    </p>
                </div>
                <Link href="/clients/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Client
                    </Button>
                </Link>
            </div>

            {/* Client List Component */}
            <ClientList />
        </div>
    )
}
