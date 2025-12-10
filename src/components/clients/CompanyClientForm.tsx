'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { UseFormRegister, FieldValues } from 'react-hook-form'

interface CompanyClientFormProps {
    register: UseFormRegister<FieldValues>
    setValue: (name: string, value: any) => void
}

export function CompanyClientForm({ register, setValue }: CompanyClientFormProps) {
    return (
        <div className="space-y-6">
            {/* Company Information */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Company Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name *</Label>
                        <Input id="companyName" placeholder="Acme Corp" required {...register('companyName', { required: true })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dba">DBA / Trade Name</Label>
                        <Input id="dba" placeholder="Acme Solutions" {...register('dbaName')} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="companyType">Company Type</Label>
                        <Select onValueChange={(val) => setValue('companyType', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pvt-ltd">Private Limited</SelectItem>
                                <SelectItem value="public-ltd">Public Limited</SelectItem>
                                <SelectItem value="llp">LLP</SelectItem>
                                <SelectItem value="partnership">Partnership</SelectItem>
                                <SelectItem value="sole-proprietor">Sole Proprietor</SelectItem>
                                <SelectItem value="non-profit">Non-Profit / Trust</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="taxId">GSTIN / PAN</Label>
                        <Input id="taxId" placeholder="22AAAAA0000A1Z5" {...register('taxId')} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="industry">Industry</Label>
                        <Select onValueChange={(val) => setValue('industry', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="technology">Technology</SelectItem>
                                <SelectItem value="healthcare">Healthcare</SelectItem>
                                <SelectItem value="finance">Finance</SelectItem>
                                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                                <SelectItem value="retail">Retail</SelectItem>
                                <SelectItem value="real-estate">Real Estate</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input id="website" placeholder="https://example.com" {...register('website')} />
                    </div>
                </div>
            </div>

            {/* Primary Contact */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Primary Contact Person</h3>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="contactName">Contact Name *</Label>
                        <Input id="contactName" placeholder="Rahul Sharma" required {...register('contactName', { required: true })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contactTitle">Title</Label>
                        <Input id="contactTitle" placeholder="Director" {...register('contactTitle')} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contactEmail">Email *</Label>
                        <Input id="contactEmail" type="email" placeholder="rahul@example.com" required {...register('contactEmail', { required: true })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contactPhone">Phone *</Label>
                        <Input id="contactPhone" placeholder="+91 99887 76655" required {...register('contactPhone', { required: true })} />
                    </div>
                </div>
            </div>

            {/* Company Address */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Registered Address</h3>
                <div className="space-y-2">
                    <Label htmlFor="hqAddress">Street Address</Label>
                    <Input id="hqAddress" placeholder="Plot 42, Sector 18" {...register('streetAddress')} />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <Label htmlFor="hqCity">City</Label>
                        <Input id="hqCity" placeholder="Gurgaon" {...register('city')} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="hqState">State</Label>
                        <Input id="hqState" placeholder="Haryana" {...register('state')} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="hqPincode">Pincode</Label>
                        <Input id="hqPincode" placeholder="122001" maxLength={6} {...register('pincode')} />
                    </div>
                </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Additional Information</h3>
                <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                        id="notes"
                        placeholder="Corporate structure, parent companies, etc."
                        className="min-h-[100px]"
                        {...register('notes')}
                    />
                </div>
            </div>
        </div>
    )
}
