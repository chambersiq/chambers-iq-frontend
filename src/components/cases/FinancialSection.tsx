'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'

export function FinancialSection() {
    const [feeType, setFeeType] = useState('hourly')

    return (
        <Card>
            <CardHeader>
                <CardTitle>Financial Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="feeArrangement">Fee Arrangement</Label>
                        <Select value={feeType} onValueChange={setFeeType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="hourly">Hourly</SelectItem>
                                <SelectItem value="contingency">Contingency</SelectItem>
                                <SelectItem value="flat-fee">Flat Fee</SelectItem>
                                <SelectItem value="hybrid">Hybrid</SelectItem>
                                <SelectItem value="pro-bono">Pro Bono</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {feeType === 'hourly' && (
                        <div className="space-y-2">
                            <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                            <Input id="hourlyRate" type="number" placeholder="400" />
                        </div>
                    )}

                    {feeType === 'contingency' && (
                        <div className="space-y-2">
                            <Label htmlFor="contingency">Contingency Percentage (%)</Label>
                            <Input id="contingency" type="number" placeholder="33.33" />
                        </div>
                    )}

                    {feeType === 'flat-fee' && (
                        <div className="space-y-2">
                            <Label htmlFor="flatFee">Flat Fee Amount ($)</Label>
                            <Input id="flatFee" type="number" placeholder="5000" />
                        </div>
                    )}
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-2">
                        <Label htmlFor="retainer">Retainer Amount ($)</Label>
                        <Input id="retainer" type="number" placeholder="5000" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="estimatedValue">Est. Case Value ($)</Label>
                        <Input id="estimatedValue" type="number" placeholder="100000" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="damages">Damages Claimed ($)</Label>
                        <Input id="damages" type="number" placeholder="75000" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
