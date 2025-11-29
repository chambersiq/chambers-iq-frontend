'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Calendar as CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn, formatDate } from '@/lib/utils'

export function ImportantDatesSection() {
    const [customDeadlines, setCustomDeadlines] = useState([0])
    const [dates, setDates] = useState<Record<string, Date | undefined>>({})

    const handleDateSelect = (key: string, date: Date | undefined) => {
        setDates(prev => ({ ...prev, [key]: date }))
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Important Dates & Deadlines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Critical Dates */}
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="sol" className="text-red-600 font-semibold">
                            Statute of Limitations *
                        </Label>
                        <DatePicker
                            selected={dates.sol}
                            onSelect={(date) => handleDateSelect('sol', date)}
                            placeholder="Select critical deadline"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="filedDate">Case Filed Date</Label>
                        <DatePicker
                            selected={dates.filed}
                            onSelect={(date) => handleDateSelect('filed', date)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="nextHearing">Next Hearing</Label>
                        <DatePicker
                            selected={dates.hearing}
                            onSelect={(date) => handleDateSelect('hearing', date)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="trialDate">Trial Date</Label>
                        <DatePicker
                            selected={dates.trial}
                            onSelect={(date) => handleDateSelect('trial', date)}
                        />
                    </div>
                </div>

                {/* Discovery & Motions */}
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="discoveryCutoff">Discovery Cutoff</Label>
                        <DatePicker
                            selected={dates.discovery}
                            onSelect={(date) => handleDateSelect('discovery', date)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="mediation">Mediation Date</Label>
                        <DatePicker
                            selected={dates.mediation}
                            onSelect={(date) => handleDateSelect('mediation', date)}
                        />
                    </div>
                </div>

                {/* Custom Deadlines */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            Custom Deadlines
                        </h3>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setCustomDeadlines([...customDeadlines, customDeadlines.length])}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Deadline
                        </Button>
                    </div>

                    {customDeadlines.map((index) => (
                        <div key={index} className="flex gap-4 items-start">
                            <div className="flex-1 space-y-2">
                                <Input placeholder="Deadline Description (e.g. Expert Witness List)" />
                            </div>
                            <div className="w-[240px] space-y-2">
                                <DatePicker
                                    selected={dates[`custom_${index}`]}
                                    onSelect={(date) => handleDateSelect(`custom_${index}`, date)}
                                />
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="mt-0 text-muted-foreground hover:text-red-600"
                                onClick={() => setCustomDeadlines(customDeadlines.filter(i => i !== index))}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

function DatePicker({
    selected,
    onSelect,
    placeholder = "Pick a date"
}: {
    selected: Date | undefined
    onSelect: (date: Date | undefined) => void
    placeholder?: string
}) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !selected && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selected ? formatDate(selected) : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={selected}
                    onSelect={onSelect}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}
