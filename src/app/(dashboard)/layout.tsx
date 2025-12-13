import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { MainLayoutWrapper } from '@/components/layout/MainLayoutWrapper'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 print:h-auto print:overflow-visible">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden print:h-auto print:overflow-visible">
                <Header />
                <MainLayoutWrapper>
                    {children}
                </MainLayoutWrapper>
            </div>
        </div>
    )
}
