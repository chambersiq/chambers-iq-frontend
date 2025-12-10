'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useFormContext } from 'react-hook-form'

export function FinancialSection() {
    const { register, setValue, watch } = useFormContext()
    const feeArrangement = watch('feeArrangement') || 'hourly'

    return (
        <Card>
            <CardHeader>
                <CardTitle>Financial Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="feeArrangement">Fee Arrangement</Label>
                        <Select
                            onValueChange={(val) => setValue('feeArrangement', val)}
                            defaultValue={feeArrangement}
                        >
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

                    {feeArrangement === 'hourly' && (
                        <div className="space-y-2">
                            <Label htmlFor="hourlyRate">Hourly Rate (₹)</Label>
                            <Input
                                id="hourlyRate"
                                type="number"
                                placeholder="5000"
                                {...register('hourlyBillingRate', { valueAsNumber: true })}
                            />
                        </div>
                    )}

                    {feeArrangement === 'contingency' && (
                        <div className="space-y-2">
                            <Label htmlFor="contingency">Success Fee / Contingency (%)</Label>
                            <Input
                                id="contingency"
                                type="number"
                                placeholder="10"
                                {...register('contingencyFeePercent', { valueAsNumber: true })}
                            />
                        </div>
                    )}

                    {feeArrangement === 'flat-fee' && (
                        <div className="space-y-2">
                            <Label htmlFor="flatFee">Flat Fee Amount (₹)</Label>
                            <Input
                                id="flatFee"
                                type="number"
                                placeholder="50000"
                                {...register('flatFeeAmount', { valueAsNumber: true })}
                            />
                        </div>
                    )}
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-2">
                        <Label htmlFor="retainer">Advance / Retainer (₹)</Label>
                        <Input
                            id="retainer"
                            type="number"
                            placeholder="25000"
                            {...register('retainerAmount', { valueAsNumber: true })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="estimatedValue">Est. Case Value (₹)</Label>
                        <Input
                            id="estimatedValue"
                            type="number"
                            placeholder="500000"
                            {...register('estimatedCaseValue', { valueAsNumber: true })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="damages">Damages Claimed (₹)</Label>
                        <Input
                            id="damages"
                            type="number"
                            placeholder="200000"
                            {...register('clientDamagesClaimed', { valueAsNumber: true })}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
