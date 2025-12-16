import { ChatInterface } from '@/components/assistant/ChatInterface'

export default function AssistantPage() {
    return (
        <div className="h-full flex flex-col space-y-4 p-6">
            <div className="flex items-center justify-between px-1">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        AI Concierge
                    </h1>
                    <p className="text-sm text-slate-500">
                        Your intelligent legal practice assistant.
                    </p>
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <ChatInterface />
            </div>
        </div>
    )
}
