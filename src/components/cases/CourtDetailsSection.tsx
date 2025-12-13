'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useFormContext, Controller } from 'react-hook-form'
import { useMasterData } from '@/contexts/MasterDataContext'

export function CourtDetailsSection() {
    const { register, control } = useFormContext()
    const { data: masterData } = useMasterData()

    return (
        <Card>
            <CardHeader>
                <CardTitle>Court & Filing Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="courtLevelId">Court Level (Indian Law)</Label>
                        <Controller
                            control={control}
                            name="courtLevelId"
                            render={({ field }) => (
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select court level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {masterData && masterData.court_levels.map((level) => (
                                            <SelectItem key={level.id} value={level.id}>
                                                {level.name} ({level.short_code})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="jurisdiction">Jurisdiction (Legacy)</Label>
                        <Input
                            id="jurisdiction"
                            placeholder="e.g. Delhi, Mumbai, Karnataka"
                            {...register('jurisdiction')}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="courtName">Court Name</Label>
                        <Input
                            id="courtName"
                            placeholder="e.g. High Court of Delhi"
                            {...register('courtName')}
                        />
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="docketNumber">Docket / Case Number</Label>
                        <Input
                            id="docketNumber"
                            placeholder="e.g. WP(C) 1234/2024"
                            {...register('docketNumber')}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="judgeName">Judge Name</Label>
                        <Input
                            id="judgeName"
                            placeholder="Hon'ble Justice ..."
                            {...register('judgeName')}
                        />
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="department">Department / Bench</Label>
                        <Input
                            id="department"
                            placeholder="e.g. Family Court Bench 1"
                            {...register('department')}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="venue">Venue</Label>
                        <Input
                            id="venue"
                            placeholder="e.g. Room 404"
                            {...register('venue')}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
