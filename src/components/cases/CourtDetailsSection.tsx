'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useFormContext, Controller } from 'react-hook-form'
import { useMasterData } from '@/contexts/MasterDataContext'

export function CourtDetailsSection() {
    const { register, control, watch } = useFormContext()
    const { data: masterData } = useMasterData()

    // Watch the selected court level from Basic Info
    const selectedCourtLevelId = watch('courtLevelId')
    const selectedCourtLevel = masterData?.court_levels.find(level => level.id === selectedCourtLevelId)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Court & Filing Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Display selected Court Level */}
                <div className="p-2.5 bg-blue-50 rounded-lg border">
                    <Label className="text-xs font-semibold text-blue-800 uppercase tracking-wide">Court Level</Label>
                    <p className="text-blue-700 font-medium text-sm mt-0.5">
                        {selectedCourtLevel ? `${selectedCourtLevel.name} (${selectedCourtLevel.short_code})` : 'Not selected'}
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="courtName">Court Name</Label>
                        <Input
                            id="courtName"
                            className="h-9"
                            placeholder="e.g. High Court of Delhi"
                            {...register('courtName')}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="docketNumber">Case Number</Label>
                        <Input
                            id="docketNumber"
                            className="h-9"
                            placeholder="e.g. WP(C) 1234/2024"
                            {...register('docketNumber')}
                        />
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="judgeName">Judge Name</Label>
                        <Input
                            id="judgeName"
                            className="h-9"
                            placeholder="Hon'ble Justice ..."
                            {...register('judgeName')}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="department">Department / Bench</Label>
                        <Input
                            id="department"
                            className="h-9"
                            placeholder="e.g. Family Court Bench 1"
                            {...register('department')}
                        />
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="venue">Venue</Label>
                        <Input
                            id="venue"
                            className="h-9"
                            placeholder="e.g. Room 404"
                            {...register('venue')}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
