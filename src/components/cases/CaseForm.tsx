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
import { CourtDetailsSection } from './CourtDetailsSection'
import { useRouter } from 'next/navigation'
import { Case, CaseFormData } from '@/types/case'
import { useForm, FormProvider, Controller } from 'react-hook-form'
import { useCreateCase, useUpdateCase } from '@/hooks/api/useCases'
import { useClients } from '@/hooks/api/useClients'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { useMasterData } from '@/contexts/MasterDataContext'

interface CaseFormProps {
    initialData?: Partial<Case>
    isEditing?: boolean
}

export function CaseForm({ initialData, isEditing = false }: CaseFormProps) {
    const router = useRouter()
    const { user } = useAuth()
    const companyId = user?.companyId || ''
    const { data: masterData } = useMasterData()

    const { data: clients = [] } = useClients(companyId)
    console.log("Clients data in CaseForm:", clients)
    const createCase = useCreateCase(companyId)
    const updateCase = useUpdateCase(companyId)



    const normPri = (p?: string) => p?.toLowerCase();

    const normFee = (f?: string) => {
        if (!f) return 'hourly';
        const lower = f.toLowerCase();
        if (lower.includes('hourly')) return 'hourly';
        if (lower.includes('flat')) return 'flat-fee';
        if (lower.includes('contingency')) return 'contingency';
        if (lower.includes('hybrid')) return 'hybrid';
        if (lower.includes('bono')) return 'pro-bono';
        return lower.replace(' ', '-');
    }

    const normLower = (s?: string) => s?.toLowerCase();

    const methods = useForm<CaseFormData>({
        defaultValues: {
            caseName: initialData?.caseName || '',
            caseNumber: initialData?.caseNumber || '',
            clientId: initialData?.clientId || '',
            status: normLower(initialData?.status) as any || 'draft',

            priority: normPri(initialData?.priority) as any || 'medium',
            feeArrangement: normFee(initialData?.feeArrangement),
            caseSummary: initialData?.caseSummary || '',
            caseTypeId: initialData?.caseTypeId || '',
            clientPosition: initialData?.clientPosition || '',
            opposingPartyPosition: initialData?.opposingPartyPosition || '',
            keyFacts: Array.isArray(initialData?.keyFacts)
                ? initialData.keyFacts.join('\n')
                : (initialData?.keyFacts || ''),
            legalIssues: initialData?.legalIssues || '',
            prayer: initialData?.prayer || '',
            caseStrategyNotes: initialData?.caseStrategyNotes || '',
            opposingPartyType: normLower(initialData?.opposingPartyType) as any || 'individual',

            // Court Details
            courtLevelId: initialData?.courtLevelId || '',
            practiceArea: initialData?.practiceArea || '',
            courtName: initialData?.courtName || '',
            docketNumber: initialData?.docketNumber || '',
            judgeName: initialData?.judgeName || '',
            department: initialData?.department || '',
            venue: initialData?.venue || '',

            // Parties
            opposingPartyName: initialData?.opposingPartyName || '',
            opposingCounselName: initialData?.opposingCounselName || '',
            opposingCounselFirm: initialData?.opposingCounselFirm || '',
            opposingCounselEmail: initialData?.opposingCounselEmail || '',
            opposingCounselPhone: initialData?.opposingCounselPhone || '',
            additionalParties: initialData?.additionalParties || [],

            // Important Dates
            statuteOfLimitationsDate: initialData?.statuteOfLimitationsDate || '',
            caseFiledDate: initialData?.caseFiledDate || '',
            nextHearingDate: initialData?.nextHearingDate || '',
            trialDate: initialData?.trialDate || '',
            discoveryCutoff: initialData?.discoveryCutoff || '',
            mediationDate: initialData?.mediationDate || '',
            settlementConferenceDate: initialData?.settlementConferenceDate || '',
            customDeadlines: initialData?.customDeadlines || [],

            // Financial
            estimatedCaseValue: initialData?.estimatedCaseValue || undefined,
            clientDamagesClaimed: initialData?.clientDamagesClaimed || undefined,
            contingencyFeePercent: initialData?.contingencyFeePercent || undefined,
            flatFeeAmount: initialData?.flatFeeAmount || undefined,
            retainerAmount: initialData?.retainerAmount || undefined,

            // Other
            caseSubType: initialData?.caseSubType || '',
            caseSource: initialData?.caseSource || '',
            conflictCheckStatus: initialData?.conflictCheckStatus || '',
            tags: initialData?.tags || [],
            caseNotes: initialData?.caseNotes || '',
            relatedCaseIds: initialData?.relatedCaseIds || [],
            allowedDocTypeIds: initialData?.allowedDocTypeIds || [],
            reliefIds: initialData?.reliefIds || [],
        } as any // Cast to any to avoid strict type checking on partial initialData
    })

    const { register, handleSubmit, setValue, watch, formState: { errors } } = methods

    const onSubmit = (data: CaseFormData) => {
        console.log("Submitting form data:", data)
        // DEBUG: Check for duplication
        if (data.clientPosition && data.clientPosition === data.opposingPartyPosition) {
            console.warn("WARNING: Client Position and Opposing Party Position are identical:", data.clientPosition)
        }
        if (!companyId) {
            toast.error("Company ID is missing")
            return
        }

        // Sanitize data globally
        const { caseNumber, ...rest } = data
        const payload = {
            ...rest,
            // Only include caseNumber if it's not empty
            ...(caseNumber ? { caseNumber } : {}),
            // Ensure arrays are initialized
            customDeadlines: data.customDeadlines || [],
            additionalParties: data.additionalParties || [],
            // Transform keyFacts from string to array if it's a string (from Textarea)
            keyFacts: typeof data.keyFacts === 'string'
                ? (data.keyFacts as string).split('\n').filter((line: string) => line.trim() !== '')
                : data.keyFacts || [],
            // Ensure numeric fields are numbers or undefined (not NaN)
            hourlyBillingRate: data.hourlyBillingRate || undefined,
            contingencyFeePercent: data.contingencyFeePercent || undefined,
            flatFeeAmount: data.flatFeeAmount || undefined,
            retainerAmount: data.retainerAmount || undefined,
            estimatedCaseValue: data.estimatedCaseValue || undefined,
            clientDamagesClaimed: data.clientDamagesClaimed || undefined,
        }

        if (isEditing && initialData?.caseId && initialData?.clientId) {
            updateCase.mutate({
                clientId: initialData.clientId,
                caseId: initialData.caseId,
                data: payload as any
            }, {
                onSuccess: () => {
                    toast.success("Case updated successfully")
                    router.push(`/cases/${initialData.caseId}`)
                },
                onError: (error) => {
                    toast.error("Failed to update case")
                    console.error(error)
                }
            })
        } else {
            // For create, clientId is in data
            if (!data.clientId) {
                toast.error("Client is required")
                return
            }

            createCase.mutate({ clientId: data.clientId, data: payload as any }, {
                onSuccess: (newCase) => {
                    toast.success("Case created successfully")
                    router.push(`/cases/${newCase.caseId}?action=created`)
                },
                onError: (error) => {
                    toast.error("Failed to create case")
                    console.error("Create case error:", error)
                }
            })
        }
    }

    // Debugging form errors
    console.log("Form errors:", errors)

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit, (errors) => console.error("Form validation errors:", errors))} className="space-y-8">
                {/* Basic Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Case Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="caseName" className={errors.caseName ? "text-red-500" : ""}>Case Name *</Label>
                            <Input
                                id="caseName"
                                placeholder="e.g. Sharma vs State of Maharashtra"
                                className={errors.caseName ? "border-red-500 focus-visible:ring-red-500" : ""}
                                {...register('caseName', { required: "Case Name is required" })}
                            />
                            {errors.caseName && <span className="text-xs text-red-500">{errors.caseName.message}</span>}
                        </div>

                        {isEditing && (
                            <div className="space-y-2">
                                <Label htmlFor="caseNumber">System Case number</Label>
                                <Input
                                    id="caseNumber"
                                    placeholder="Auto-generated system reference"
                                    {...register('caseNumber')}
                                    disabled={true}
                                    className="bg-gray-50 cursor-not-allowed"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="client" className={errors.clientId ? "text-red-500" : ""}>Client *</Label>
                            <Controller
                                control={methods.control}
                                name="clientId"
                                rules={{ required: "Client is required" }}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <SelectTrigger className={errors.clientId ? "border-red-500 focus:ring-red-500" : ""}>
                                            <SelectValue placeholder="Select client" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {clients.length === 0 && (
                                                <SelectItem value="no-clients" disabled>
                                                    No clients found
                                                </SelectItem>
                                            )}
                                            {clients.map((client) => {
                                                console.log("Rendering client:", client)
                                                const label = client.clientType === 'individual'
                                                    ? client.fullName
                                                    : client.companyName;
                                                return (
                                                    <SelectItem key={client.clientId} value={client.clientId}>
                                                        {label}
                                                    </SelectItem>
                                                )
                                            })}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.clientId && <span className="text-xs text-red-500">{errors.clientId.message}</span>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Controller
                                control={methods.control}
                                name="status"
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
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
                                )}
                            />
                        </div>


                        {/* Phase 2: Indian Law Categorization */}
                        {masterData && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="courtLevelId" className={errors.courtLevelId ? "text-red-500" : ""}>Court Level *</Label>
                                    <Controller
                                        control={methods.control}
                                        name="courtLevelId"
                                        rules={{ required: "Court Level is required" }}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className={errors.courtLevelId ? "border-red-500 focus:ring-red-500" : ""}>
                                                    <SelectValue placeholder="Select court level" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {masterData.court_levels.map((level) => (
                                                        <SelectItem key={level.id} value={level.id}>
                                                            {level.name} ({level.short_code})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.courtLevelId && <span className="text-xs text-red-500">{errors.courtLevelId.message}</span>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="practiceArea">Practice Area (Indian Law)</Label>
                                    <Controller
                                        control={methods.control}
                                        name="practiceArea"
                                        render={({ field }) => {
                                            const areas = Array.from(new Set(masterData.case_types.map(ct => ct.practice_area)));
                                            return (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select practice area" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {areas.map(area => (
                                                            <SelectItem key={area} value={area}>{area}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            );
                                        }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="caseTypeId">Specific Case Type *</Label>
                                    <Controller
                                        control={methods.control}
                                        name="caseTypeId"
                                        rules={{ required: "Specific Case Type is required" }}
                                        render={({ field }) => {
                                            const selectedArea = watch('practiceArea');
                                            const types = masterData.case_types.filter(ct => !selectedArea || ct.practice_area === selectedArea);
                                            return (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select specific type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {types.map(ct => (
                                                            <SelectItem key={ct.id} value={ct.id}>{ct.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            );
                                        }}
                                    />
                                </div>
                            </>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority</Label>
                            <Controller
                                control={methods.control}
                                name="priority"
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
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
                                )}
                            />
                        </div>

                    </CardContent>
                </Card>

                {/* Sections */}
                <PartiesSection />
                <CaseSummarySection />
                <CourtDetailsSection />
                <ImportantDatesSection />
                <FinancialSection />

                {/* Actions */}
                <div className="flex items-center justify-end gap-4 sticky bottom-6 bg-white p-4 border rounded-lg shadow-lg">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" size="lg" disabled={createCase.isPending || updateCase.isPending}>
                        {createCase.isPending || updateCase.isPending ? 'Saving...' : (isEditing ? 'Update Case' : 'Create Case')}
                    </Button>
                </div>
            </form>
        </FormProvider>
    )
}
