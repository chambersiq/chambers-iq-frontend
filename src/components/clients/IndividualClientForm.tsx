'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { UseFormRegister, FieldValues } from 'react-hook-form'

interface IndividualClientFormProps {
    register: UseFormRegister<FieldValues>
    setValue: (name: string, value: any) => void
}

export function IndividualClientForm({ register, setValue }: IndividualClientFormProps) {
    return (
        <div className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Personal Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input id="fullName" placeholder="Amit Verma" required {...register('fullName', { required: true })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" type="email" placeholder="amit.verma@example.com" required {...register('email', { required: true })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input id="phone" placeholder="+91 98765 43210" required {...register('phone', { required: true })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="alternatePhone">Alternate Phone</Label>
                        <Input id="alternatePhone" placeholder="+91 98765 43210" {...register('alternatePhone')} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input id="dob" type="date" {...register('dateOfBirth')} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select onValueChange={(val) => setValue('gender', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="pan">PAN Number</Label>
                        <Input id="pan" placeholder="ABCDE1234F" maxLength={10} className="uppercase" {...register('pan')} />
                    </div>
                </div>
            </div>

            {/* Address */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Address</h3>
                <div className="space-y-2">
                    <Label htmlFor="streetAddress">Street Address</Label>
                    <Input id="streetAddress" placeholder="Flat 402, Galaxy Apartments" {...register('streetAddress')} />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" placeholder="Mumbai" {...register('city')} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" placeholder="Maharashtra" {...register('state')} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input id="pincode" placeholder="400001" maxLength={6} {...register('pincode')} />
                    </div>
                </div>
            </div>

            {/* Employment */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Employment (Optional)</h3>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="employer">Employer Name</Label>
                        <Input id="employer" placeholder="Acme Inc." {...register('employerName')} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="jobTitle">Job Title</Label>
                        <Input id="jobTitle" placeholder="Software Engineer" {...register('jobTitle')} />
                    </div>
                </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Additional Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="preferredContact">Preferred Contact Method</Label>
                        <Select onValueChange={(val) => setValue('preferredContactMethod', val)} defaultValue="email">
                            <SelectTrigger>
                                <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="phone">Phone</SelectItem>
                                <SelectItem value="text">Text Message</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="language">Preferred Language</Label>
                        <Select onValueChange={(val) => setValue('preferredLanguage', val)} defaultValue="english">
                            <SelectTrigger>
                                <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="english">English</SelectItem>
                                <SelectItem value="spanish">Spanish</SelectItem>
                                <SelectItem value="french">French</SelectItem>
                                <SelectItem value="mandarin">Mandarin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                        id="notes"
                        placeholder="Any special considerations, medical conditions, etc."
                        className="min-h-[100px]"
                        {...register('notes')}
                    />
                </div>
            </div>
        </div>
    )
}
