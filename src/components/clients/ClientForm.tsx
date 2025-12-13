'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { IndividualClientForm } from './IndividualClientForm'
import { CompanyClientForm } from './CompanyClientForm'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useCreateClient, useUpdateClient } from '@/hooks/api/useClients'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'
import { useMasterData } from '@/contexts/MasterDataContext'

export interface ClientFormProps {
    initialData?: any // Client type from API
    clientId?: string
}



export function ClientForm({ initialData, clientId }: ClientFormProps) {
    const router = useRouter()
    const { user } = useAuth()
    const companyId = user?.companyId

    const { data: masterData } = useMasterData()
    const { register, handleSubmit, setValue, reset, watch } = useForm({
        defaultValues: initialData || {}
    })

    // Watch partyTypeId to sync clientType logic if needed, or just handle in onValueChange
    const [selectedPartyTypeId, setSelectedPartyTypeId] = useState<string>(
        initialData?.partyTypeId || 'PT_01'
    )

    // Derived State
    const clientType = selectedPartyTypeId === 'PT_01' ? 'individual' : 'company'

    // ... (keep mutations)
    const createClient = useCreateClient(companyId || '')
    const updateClient = useUpdateClient(companyId || '')
    const isEditing = !!initialData

    const onSubmit = (data: any) => {
        if (!companyId) {
            toast.error("Company ID is missing.")
            return
        }

        const payload = {
            ...data,
            clientType: clientType,
            partyTypeId: selectedPartyTypeId
        }
        // ... (rest of submit)
        if (isEditing && clientId) {
            updateClient.mutate({ clientId, data: payload }, {
                onSuccess: () => {
                    toast.success("Client updated successfully.")
                    router.push('/clients')
                },
                onError: (error) => {
                    toast.error("Failed to update client.")
                    console.error(error)
                }
            })
        } else {
            createClient.mutate(payload, {
                onSuccess: () => {
                    toast.success("Client created successfully.")
                    router.push('/clients')
                },
                onError: (error) => {
                    toast.error("Failed to create client.")
                    console.error(error)
                }
            })
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
                {/* Client Type Selection */}
                <Card>
                    <CardHeader>
                        <CardTitle>Client Entity Type</CardTitle>
                        <CardDescription>Select the legal status of the client.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Use a Grid of Radio Cards for better UX with many options */}
                        <RadioGroup
                            value={selectedPartyTypeId}
                            onValueChange={(value) => {
                                setSelectedPartyTypeId(value)
                                setValue('partyTypeId', value)
                            }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4"
                            disabled={isEditing}
                        >
                            {masterData?.party_types?.map((type) => (
                                <div key={type.id}>
                                    <RadioGroupItem value={type.id} id={type.id} className="peer sr-only" />
                                    <Label
                                        htmlFor={type.id}
                                        className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary ${isEditing ? 'opacity-50 cursor-not-allowed' : ''} cursor-pointer h-full`}
                                    >
                                        <span className="text-base font-semibold text-center">{type.name}</span>
                                        {/* Optional: Add icon or description if available in master data */}
                                    </Label>
                                </div>
                            ))}
                            {!masterData && (
                                <div className="col-span-3 text-center text-muted-foreground">Loading types...</div>
                            )}
                        </RadioGroup>
                    </CardContent>
                </Card>

                {/* Dynamic Form Content */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {clientType === 'individual' ? 'Personal Information' : 'Company Information'}
                        </CardTitle>
                        <CardDescription>
                            {clientType === 'individual'
                                ? 'Enter the details for the individual client.'
                                : 'Enter the details for the company client.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {clientType === 'individual' ? (
                            <IndividualClientForm register={register} setValue={setValue} />
                        ) : (
                            <CompanyClientForm register={register} setValue={setValue} />
                        )}
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex items-center justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={createClient.isPending || updateClient.isPending}>
                        {isEditing
                            ? (updateClient.isPending ? 'Updating...' : 'Save Changes')
                            : (createClient.isPending ? 'Creating...' : 'Create Client')
                        }
                    </Button>
                </div>
            </div>
        </form>
    )
}
