'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

export function PartiesSection() {
    const [additionalParties, setAdditionalParties] = useState([0])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Parties & Counsel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Opposing Party */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        Opposing Party
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="opposingName">Opposing Party Name</Label>
                            <Input id="opposingName" placeholder="XYZ Corp / John Doe" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="opposingType">Type</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="individual">Individual</SelectItem>
                                    <SelectItem value="company">Company</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Opposing Counsel */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        Opposing Counsel
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="counselName">Counsel Name</Label>
                            <Input id="counselName" placeholder="Jane Lawyer" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="counselFirm">Law Firm</Label>
                            <Input id="counselFirm" placeholder="Big Law LLP" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="counselEmail">Email</Label>
                            <Input id="counselEmail" type="email" placeholder="jane@biglaw.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="counselPhone">Phone</Label>
                            <Input id="counselPhone" placeholder="(555) 999-8888" />
                        </div>
                    </div>
                </div>

                {/* Additional Parties */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            Additional Parties
                        </h3>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setAdditionalParties([...additionalParties, additionalParties.length])}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Party
                        </Button>
                    </div>

                    {additionalParties.map((index) => (
                        <div key={index} className="rounded-md border p-4 relative">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-2 text-muted-foreground hover:text-red-600"
                                onClick={() => setAdditionalParties(additionalParties.filter(i => i !== index))}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            <div className="grid gap-4 md:grid-cols-2 pr-8">
                                <div className="space-y-2">
                                    <Label>Name</Label>
                                    <Input placeholder="Party Name" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Role</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="co-defendant">Co-Defendant</SelectItem>
                                            <SelectItem value="cross-defendant">Cross-Defendant</SelectItem>
                                            <SelectItem value="intervener">Intervener</SelectItem>
                                            <SelectItem value="witness">Key Witness</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
