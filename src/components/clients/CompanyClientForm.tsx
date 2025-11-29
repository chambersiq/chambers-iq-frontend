'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export function CompanyClientForm() {
    return (
        <div className="space-y-6">
            {/* Company Information */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Company Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name *</Label>
                        <Input id="companyName" placeholder="Acme Corp" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dba">DBA / Trade Name</Label>
                        <Input id="dba" placeholder="Acme Solutions" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="companyType">Company Type</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="llc">LLC</SelectItem>
                                <SelectItem value="corporation">Corporation</SelectItem>
                                <SelectItem value="partnership">Partnership</SelectItem>
                                <SelectItem value="sole-proprietor">Sole Proprietor</SelectItem>
                                <SelectItem value="non-profit">Non-Profit</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="taxId">Tax ID / EIN</Label>
                        <Input id="taxId" placeholder="12-3456789" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="industry">Industry</Label>
                        <Select>
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
                        <Input id="website" placeholder="https://example.com" />
                    </div>
                </div>
            </div>

            {/* Primary Contact */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Primary Contact Person</h3>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="contactName">Contact Name *</Label>
                        <Input id="contactName" placeholder="Jane Doe" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contactTitle">Title</Label>
                        <Input id="contactTitle" placeholder="CEO" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contactEmail">Email *</Label>
                        <Input id="contactEmail" type="email" placeholder="jane@example.com" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contactPhone">Phone *</Label>
                        <Input id="contactPhone" placeholder="(555) 123-4567" required />
                    </div>
                </div>
            </div>

            {/* Company Address */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Headquarters Address</h3>
                <div className="space-y-2">
                    <Label htmlFor="hqAddress">Street Address</Label>
                    <Input id="hqAddress" placeholder="123 Corporate Blvd" />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <Label htmlFor="hqCity">City</Label>
                        <Input id="hqCity" placeholder="San Francisco" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="hqState">State</Label>
                        <Input id="hqState" placeholder="CA" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="hqZip">ZIP Code</Label>
                        <Input id="hqZip" placeholder="94105" />
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
                    />
                </div>
            </div>
        </div>
    )
}
