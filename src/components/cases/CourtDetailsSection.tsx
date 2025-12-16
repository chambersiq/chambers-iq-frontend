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
            <CardContent className="space-y-6">
                {/* Display selected Court Level */}
                <div className="p-3 bg-blue-50 rounded-lg border">
                    <Label className="text-sm font-medium text-blue-800">Court Level</Label>
                    <p className="text-blue-600 font-medium">
                        {selectedCourtLevel ? `${selectedCourtLevel.name} (${selectedCourtLevel.short_code})` : 'Not selected'}
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="courtName">Court Name</Label>
                        <Input
                            id="courtName"
                            placeholder="e.g. High Court of Delhi"
                            {...register('courtName')}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="docketNumber">Case Number</Label>
                        <Input
                            id="docketNumber"
                            placeholder="e.g. WP(C) 1234/2024"
                            {...register('docketNumber')}
                        />
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="judgeName">Judge Name</Label>
                        <Input
                            id="judgeName"
                            placeholder="Hon'ble Justice ..."
                            {...register('judgeName')}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="department">Department / Bench</Label>
                        <Input
                            id="department"
                            placeholder="e.g. Family Court Bench 1"
                            {...register('department')}
                        />
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
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
