import { CaseForm } from '@/components/cases/CaseForm'

export default function NewCasePage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Create New Case</h1>
                <p className="mt-2 text-slate-600">
                    Start a new legal matter. Provide as much detail as possible for AI assistance.
                </p>
            </div>

            <CaseForm />
        </div>
    )
}
