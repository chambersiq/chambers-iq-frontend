'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CaseSummarySection } from './CaseSummarySection'
import { PartiesSection } from './PartiesSection'
import { ImportantDatesSection } from './ImportantDatesSection'
import { FinancialSection } from './FinancialSection'
import { useRouter } from 'next/navigation'
import { Case } from '@/types/case'

interface CaseFormProps {
    initialData?: Partial<Case>
    isEditing?: boolean
}

export function CaseForm({ initialData, isEditing = false }: CaseFormProps) {
    const router = useRouter()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: Handle submission
        console.log('Case submitted')
        // Mock ID '1' for now, or use existing ID
        const targetId = initialData?.id || '1'
        router.push(`/cases/${targetId}?action=${isEditing ? 'updated' : 'created'}`)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Case Information</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="caseName">Case Name *</Label>
                        <Input
                            id="caseName"
                            placeholder="e.g. Smith v. Jones"
                            required
                            defaultValue={initialData?.caseName}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="caseNumber">Case Number</Label>
                        <Input
                            id="caseNumber"
                            placeholder="Auto-generated if empty"
                            defaultValue={initialData?.caseNumber}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="client">Client *</Label>
                        <Select required defaultValue={initialData?.clientId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select client" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">John Smith</SelectItem>
                                <SelectItem value="2">Acme Corp</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select defaultValue={initialData?.status || "draft"}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="discovery">Discovery</SelectItem>
                                <SelectItem value="motion-practice">Motion Practice</SelectItem>
                                <SelectItem value="trial">Trial</SelectItem>
                                <SelectItem value="settlement">Settlement</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                                <SelectItem value="on-hold">On Hold</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="type">Case Type *</Label>
                        <Select required defaultValue={initialData?.caseType?.split('-')[0] || undefined}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="civil">Civil Litigation</SelectItem>
                                <SelectItem value="criminal">Criminal Defense</SelectItem>
                                <SelectItem value="family">Family Law</SelectItem>
                                <SelectItem value="corporate">Corporate</SelectItem>
                                <SelectItem value="ip">Intellectual Property</SelectItem>
                                <SelectItem value="employment">Employment</SelectItem>
                                <SelectItem value="real-estate">Real Estate</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select defaultValue={initialData?.priority || "medium"}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Sections */}
            <CaseSummarySection initialData={initialData?.caseSummary} />
            <PartiesSection />
            <ImportantDatesSection />
            <FinancialSection />

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 sticky bottom-6 bg-white p-4 border rounded-lg shadow-lg">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                </Button>
                <Button type="submit" size="lg">
                    {isEditing ? 'Update Case' : 'Create Case'}
                </Button>
            </div>
        </form>
    )
}
