'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    Users,
    Briefcase,
    FileText,
    FileType,
    Edit3,
    Home,
    Settings,
    HelpCircle,
    Shield,
    ShieldAlert,
    Crown,
} from 'lucide-react'

const navigation = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: Home,
    },
    {
        name: 'Clients',
        href: '/clients',
        icon: Users,
    },
    {
        name: 'Cases',
        href: '/cases',
        icon: Briefcase,
    },
    {
        name: 'Documents',
        href: '/documents',
        icon: FileText,
    },
    {
        name: 'Templates',
        href: '/templates',
        icon: FileType,
    },
    {
        name: 'Drafting',
        href: '/drafts',
        icon: Edit3,
    },
]

const secondaryNavigation = [
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Help', href: '/help', icon: HelpCircle },
]

import { signOut, useSession } from 'next-auth/react'
import { LogOut } from 'lucide-react'
import { getInitials } from '@/lib/utils'

// ... existing imports ...

import { useAuth, useCompany } from '@/hooks/api/useCompany'

import { useSidebarState } from '@/hooks/useSidebarState'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function Sidebar() {
    const pathname = usePathname()
    const { user } = useAuth()
    const { data: company, isLoading: isCompanyLoading } = useCompany(user.companyId || '')
    const { isCollapsed, toggle, isLoaded } = useSidebarState()

    if (!isLoaded) return null // Prevent hydration mismatch or flash

    return (
        <div className={cn(
            "flex h-full flex-col bg-slate-900 text-white transition-all duration-300 ease-in-out relative",
            isCollapsed ? "w-20" : "w-64"
        )}>
            {/* Toggle Button */}
            <button
                onClick={toggle}
                className="absolute -right-3 top-8 bg-slate-800 text-slate-400 border border-slate-700 rounded-full p-1 hover:text-white hover:bg-slate-700 z-50"
            >
                {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
            </button>

            {/* Logo */}
            <div className={cn(
                "flex h-16 items-center px-6 border-b border-slate-800",
                isCollapsed ? "justify-center px-0" : ""
            )}>
                <Link href="/dashboard" className="flex items-center">
                    <Briefcase className="h-8 w-8 text-blue-400 flex-shrink-0" />
                    {!isCollapsed && (
                        <div className="ml-3 flex flex-col overflow-hidden">
                            <span className="text-lg font-bold leading-none truncate max-w-[160px]">
                                {isCompanyLoading ? 'Chambers IQ' : (company?.name || 'Chambers IQ')}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium mt-1">
                                powered by Chambers IQ
                            </span>
                        </div>
                    )}
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto overflow-x-hidden">
                <div className="space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                title={isCollapsed ? item.name : undefined}
                                className={cn(
                                    'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-slate-800 text-white'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white',
                                    isCollapsed ? 'justify-center' : 'justify-between'
                                )}
                            >
                                <div className="flex items-center">
                                    <item.icon className={cn("h-5 w-5", isCollapsed ? "mr-0" : "mr-3")} />
                                    {!isCollapsed && item.name}
                                </div>
                            </Link>
                        )
                    })}
                </div>

                <div className="mt-8 pt-8 border-t border-slate-800 space-y-1">
                    {secondaryNavigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                title={isCollapsed ? item.name : undefined}
                                className={cn(
                                    'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-slate-800 text-white'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white',
                                    isCollapsed ? 'justify-center' : ''
                                )}
                            >
                                <item.icon className={cn("h-5 w-5", isCollapsed ? "mr-0" : "mr-3")} />
                                {!isCollapsed && item.name}
                            </Link>
                        )
                    })}
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        title={isCollapsed ? "Sign Out" : undefined}
                        className={cn(
                            "flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors",
                            isCollapsed ? "justify-center" : ""
                        )}
                    >
                        <LogOut className={cn("h-5 w-5", isCollapsed ? "mr-0" : "mr-3")} />
                        {!isCollapsed && "Sign Out"}
                    </button>
                </div>
            </nav>

            {/* User Profile */}
            <div className="border-t border-slate-800 p-4">
                <div className={cn("flex items-center", isCollapsed ? "justify-center" : "")}>
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-white font-semibold">
                        {user.fullName ? getInitials(user.fullName) : 'U'}
                    </div>
                    {!isCollapsed && (
                        <div className="ml-3 overflow-hidden">
                            <p className="text-sm font-medium truncate">{user.fullName || 'User'}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                {(() => {
                                    switch (user.role) {
                                        case 'super_admin':
                                            return (
                                                <>
                                                    <Crown className="h-3 w-3 text-purple-400" />
                                                    <span className="text-[10px] font-medium text-purple-400 uppercase tracking-wider">Super Admin</span>
                                                </>
                                            )
                                        case 'admin':
                                            return (
                                                <>
                                                    <ShieldAlert className="h-3 w-3 text-blue-400" />
                                                    <span className="text-[10px] font-medium text-blue-400 uppercase tracking-wider">Admin</span>
                                                </>
                                            )
                                        default:
                                            return (
                                                <>
                                                    <Shield className="h-3 w-3 text-slate-400" />
                                                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Advocate</span>
                                                </>
                                            )
                                    }
                                })()}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
