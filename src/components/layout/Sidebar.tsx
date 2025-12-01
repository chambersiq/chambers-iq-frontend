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

export function Sidebar() {
    const pathname = usePathname()
    const { user } = useAuth()
    const { data: company, isLoading: isCompanyLoading } = useCompany(user.companyId)

    return (
        <div className="flex h-full w-64 flex-col bg-slate-900 text-white">
            {/* Logo */}
            <div className="flex h-16 items-center px-6 border-b border-slate-800">
                <Link href="/dashboard" className="flex items-center">
                    <Briefcase className="h-8 w-8 text-blue-400" />
                    <div className="ml-3 flex flex-col">
                        <span className="text-lg font-bold leading-none truncate max-w-[160px]">
                            {isCompanyLoading ? 'Chambers IQ' : (company?.name || 'Chambers IQ')}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium mt-1">
                            powered by Chambers IQ
                        </span>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
                <div className="space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    'flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-slate-800 text-white'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                )}
                            >
                                <div className="flex items-center">
                                    <item.icon className="h-5 w-5 mr-3" />
                                    {item.name}
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
                                className={cn(
                                    'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-slate-800 text-white'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                )}
                            >
                                <item.icon className="h-5 w-5 mr-3" />
                                {item.name}
                            </Link>
                        )
                    })}
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                        <LogOut className="h-5 w-5 mr-3" />
                        Sign Out
                    </button>
                </div>
            </nav>

            {/* User Profile */}
            <div className="border-t border-slate-800 p-4">
                <div className="flex items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white font-semibold">
                        {user.fullName ? getInitials(user.fullName) : 'U'}
                    </div>
                    <div className="ml-3 overflow-hidden">
                        <p className="text-sm font-medium truncate">{user.fullName || 'User'}</p>
                        <p className="text-xs text-slate-400 truncate capitalize">{user.role || 'User'}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
