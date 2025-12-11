'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TeamManagement } from '@/components/settings/TeamManagement'
import { CompanyProfile } from '@/components/settings/CompanyProfile'
import { User, Mail, Lock, Building } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function SettingsPage() {
    const { user } = useAuth()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                <p className="mt-2 text-slate-600">Manage your workspace preferences and team access.</p>
            </div>

            <Tabs defaultValue="team" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="team" className="gap-2">
                        <User className="h-4 w-4" /> Team
                    </TabsTrigger>
                    <TabsTrigger value="company" className="gap-2">
                        <Building className="h-4 w-4" /> Company
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="team" className="space-y-6">
                    <TeamManagement />
                </TabsContent>

                <TabsContent value="company">
                    <CompanyProfile />
                </TabsContent>
            </Tabs>
        </div>
    )
}
