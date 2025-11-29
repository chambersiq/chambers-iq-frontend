'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export function IndividualClientForm() {
    return (
        <div className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Personal Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input id="fullName" placeholder="John Doe" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" type="email" placeholder="john@example.com" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input id="phone" placeholder="(555) 123-4567" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="alternatePhone">Alternate Phone</Label>
                        <Input id="alternatePhone" placeholder="(555) 987-6543" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input id="dob" type="date" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select>
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
                        <Label htmlFor="ssn">SSN (Last 4)</Label>
                        <Input id="ssn" placeholder="1234" maxLength={4} />
                    </div>
                </div>
            </div>

            {/* Address */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Address</h3>
                <div className="space-y-2">
                    <Label htmlFor="streetAddress">Street Address</Label>
                    <Input id="streetAddress" placeholder="123 Main St" />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" placeholder="New York" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" placeholder="NY" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input id="zipCode" placeholder="10001" />
                    </div>
                </div>
            </div>

            {/* Employment */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Employment (Optional)</h3>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="employer">Employer Name</Label>
                        <Input id="employer" placeholder="Acme Inc." />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="jobTitle">Job Title</Label>
                        <Input id="jobTitle" placeholder="Software Engineer" />
                    </div>
                </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Additional Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="preferredContact">Preferred Contact Method</Label>
                        <Select defaultValue="email">
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
                        <Select defaultValue="english">
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
                    />
                </div>
            </div>
        </div>
    )
}
