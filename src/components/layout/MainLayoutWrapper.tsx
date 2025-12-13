'use client'

import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    // Check if we are on a Draft Editor page (e.g. /drafts/123-abc)
    // We want full bleed (no padding) only on the specific editor page, not the list page.
    const isDraftEditor = pathname?.startsWith('/drafts/') && pathname !== '/drafts' && pathname !== '/drafts/new'

    return (
        <main className={cn(
            "flex-1 overflow-y-auto print:overflow-visible print:p-0",
            isDraftEditor ? "p-0 overflow-hidden" : "p-6"
        )}>
            {children}
        </main>
    )
}
