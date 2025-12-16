'use client'

import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    // Check for full bleed pages (Draft Editor, Assistant)
    // We want full bleed (no padding) only on specific pages needed for full-height apps
    const isFullBleed = (pathname?.startsWith('/drafts/') && pathname !== '/drafts' && pathname !== '/drafts/new') ||
        pathname?.startsWith('/assistant')

    return (
        <main className={cn(
            "flex-1 overflow-y-auto print:overflow-visible print:p-0",
            isFullBleed ? "p-0 overflow-hidden" : "p-6"
        )}>
            {children}
        </main>
    )
}
