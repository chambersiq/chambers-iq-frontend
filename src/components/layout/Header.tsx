'use client'

import { Bell, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
    return (
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white px-6">
            {/* Search */}
            <div className="flex-1">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="search"
                        placeholder="Search clients, cases, documents..."
                        className="h-10 w-full rounded-md border border-slate-200 bg-white pl-10 pr-4 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                </Button>

                {/* User Menu */}
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-sm font-medium">John Doe</p>
                        <p className="text-xs text-slate-500">Attorney</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white font-semibold">
                        JD
                    </div>
                </div>
            </div>
        </header>
    )
}
