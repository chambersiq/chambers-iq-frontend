'use client'

import { Bell, Search, LogOut, Shield, ShieldAlert, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'

import { useCompany } from '@/hooks/api/useCompany'
import { useAuth } from '@/hooks/useAuth'
import { getInitials } from '@/lib/utils'

export function Header() {
    const { user } = useAuth()

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
                <div className="flex items-center gap-3 border-r border-slate-200 pr-4 mr-1">
                    <div className="text-right">
                        <p className="text-sm font-medium">{user.fullName || 'User'}</p>
                        <div className="flex items-center justify-end gap-1.5 mt-0.5">
                            {(() => {
                                switch (user.role) {
                                    case 'super_admin':
                                        return (
                                            <>
                                                <span className="text-[10px] font-medium text-purple-600 uppercase tracking-wider">Super Admin</span>
                                                <Crown className="h-3 w-3 text-purple-600" />
                                            </>
                                        )
                                    case 'admin':
                                        return (
                                            <>
                                                <span className="text-[10px] font-medium text-blue-600 uppercase tracking-wider">Admin</span>
                                                <ShieldAlert className="h-3 w-3 text-blue-600" />
                                            </>
                                        )
                                    default:
                                        return (
                                            <>
                                                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Advocate</span>
                                                <Shield className="h-3 w-3 text-slate-500" />
                                            </>
                                        )
                                }
                            })()}
                        </div>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white font-semibold">
                        {user.fullName ? getInitials(user.fullName) : 'U'}
                    </div>
                </div>

                {/* Logout */}
                <Button
                    variant="ghost"
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="text-slate-500 hover:text-red-600 gap-2"
                >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                </Button>
            </div>
        </header>
    )
}
