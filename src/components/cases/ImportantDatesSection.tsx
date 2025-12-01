'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Calendar as CalendarIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn, formatDate } from '@/lib/utils'
import { useFormContext, Controller, useFieldArray } from 'react-hook-form'

export function ImportantDatesSection() {
    const { control, register } = useFormContext()
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'customDeadlines'
    })

    return (
        <Card>
            <CardHeader>
                <CardTitle>Important Dates & Deadlines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Critical Dates */}
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="sol">
                            Statute of Limitations
                        </Label>
                        <Controller
                            control={control}
                            name="statuteOfLimitationsDate"
                            render={({ field }) => (
                                <DatePicker
                                    selected={field.value ? new Date(field.value) : undefined}
                                    onSelect={(date) => field.onChange(date?.toISOString())}
                                    placeholder="Select critical deadline"
                                />
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="filedDate">Case Filed Date</Label>
                        <Controller
                            control={control}
                            name="caseFiledDate"
                            render={({ field }) => (
                                <DatePicker
                                    selected={field.value ? new Date(field.value) : undefined}
                                    onSelect={(date) => field.onChange(date?.toISOString())}
                                />
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="nextHearing">Next Hearing</Label>
                        <Controller
                            control={control}
                            name="nextHearingDate"
                            render={({ field }) => (
                                <DatePicker
                                    selected={field.value ? new Date(field.value) : undefined}
                                    onSelect={(date) => field.onChange(date?.toISOString())}
                                />
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="trialDate">Trial Date</Label>
                        <Controller
                            control={control}
                            name="trialDate"
                            render={({ field }) => (
                                <DatePicker
                                    selected={field.value ? new Date(field.value) : undefined}
                                    onSelect={(date) => field.onChange(date?.toISOString())}
                                />
                            )}
                        />
                    </div>
                </div>

                {/* Discovery & Motions */}
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="discoveryCutoff">Discovery Cutoff</Label>
                        <Controller
                            control={control}
                            name="discoveryCutoff"
                            render={({ field }) => (
                                <DatePicker
                                    selected={field.value ? new Date(field.value) : undefined}
                                    onSelect={(date) => field.onChange(date?.toISOString())}
                                />
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="mediation">Mediation Date</Label>
                        <Controller
                            control={control}
                            name="mediationDate"
                            render={({ field }) => (
                                <DatePicker
                                    selected={field.value ? new Date(field.value) : undefined}
                                    onSelect={(date) => field.onChange(date?.toISOString())}
                                />
                            )}
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
                            onClick={() => append({ name: '', date: '' })}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Deadline
                        </Button>
                    </div>

                    {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-4 items-start">
                            <div className="flex-1 space-y-2">
                                <Input
                                    placeholder="Deadline Description (e.g. Expert Witness List)"
                                    {...register(`customDeadlines.${index}.name`)}
                                />
                            </div>
                            <div className="w-[240px] space-y-2">
                                <Controller
                                    control={control}
                                    name={`customDeadlines.${index}.date`}
                                    render={({ field }) => (
                                        <DatePicker
                                            selected={field.value ? new Date(field.value) : undefined}
                                            onSelect={(date) => field.onChange(date?.toISOString())}
                                        />
                                    )}
                                />
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="mt-0 text-muted-foreground hover:text-red-600"
                                onClick={() => remove(index)}
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
