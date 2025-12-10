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
import { useAuth } from '@/hooks/api/useCompany'
import { toast } from 'sonner'

export interface ClientFormProps {
    initialData?: any // Client type from API
    clientId?: string
}

export function ClientForm({ initialData, clientId }: ClientFormProps) {
    const router = useRouter()
    const { user } = useAuth()
    const companyId = user?.companyId
    const [clientType, setClientType] = useState<'individual' | 'company'>(
        initialData?.clientType || 'individual'
    )

    const { register, handleSubmit, setValue, reset } = useForm({
        defaultValues: initialData || {}
    })

    // Mutations
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
        }

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
                        <CardTitle>Client Type</CardTitle>
                        <CardDescription>Select the type of client you are adding.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup
                            defaultValue="individual"
                            value={clientType}
                            onValueChange={(value) => {
                                setClientType(value as 'individual' | 'company')
                            }}
                            className="grid grid-cols-2 gap-4"
                            disabled={isEditing}
                        >
                            <div>
                                <RadioGroupItem value="individual" id="individual" className="peer sr-only" />
                                <Label
                                    htmlFor="individual"
                                    className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary ${isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <span className="text-lg font-semibold">Individual</span>
                                    <span className="text-sm text-muted-foreground">Person</span>
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="company" id="company" className="peer sr-only" />
                                <Label
                                    htmlFor="company"
                                    className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary ${isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <span className="text-lg font-semibold">Company</span>
                                    <span className="text-sm text-muted-foreground">Business Entity</span>
                                </Label>
                            </div>
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
