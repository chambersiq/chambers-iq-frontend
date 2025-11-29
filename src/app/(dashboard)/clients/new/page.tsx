import { ClientForm } from '@/components/clients/ClientForm'

export default function NewClientPage() {
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Add New Client</h1>
                <p className="mt-2 text-slate-600">
                    Create a new client record. Choose between Individual or Company type.
                </p>
            </div>

            <ClientForm />
        </div>
    )
}
