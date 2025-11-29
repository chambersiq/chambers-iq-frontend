'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { IndividualClientForm } from './IndividualClientForm'
import { CompanyClientForm } from './CompanyClientForm'
import { useRouter } from 'next/navigation'

export function ClientForm() {
    const router = useRouter()
    const [clientType, setClientType] = useState<'individual' | 'company'>('individual')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: Handle form submission
        console.log('Form submitted')
        router.push('/clients')
    }

    return (
        <form onSubmit={handleSubmit}>
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
                            onValueChange={(value) => setClientType(value as 'individual' | 'company')}
                            className="grid grid-cols-2 gap-4"
                        >
                            <div>
                                <RadioGroupItem value="individual" id="individual" className="peer sr-only" />
                                <Label
                                    htmlFor="individual"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                    <span className="text-lg font-semibold">Individual</span>
                                    <span className="text-sm text-muted-foreground">Person</span>
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="company" id="company" className="peer sr-only" />
                                <Label
                                    htmlFor="company"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
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
                        {clientType === 'individual' ? <IndividualClientForm /> : <CompanyClientForm />}
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex items-center justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit">Create Client</Button>
                </div>
            </div>
        </form>
    )
}
