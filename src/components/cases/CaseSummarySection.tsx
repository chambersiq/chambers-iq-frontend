'use client'

import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Info } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

export function CaseSummarySection() {
    const { register, watch } = useFormContext()
    const summary = watch('caseSummary') || ''

    return (
        <Card>
            <CardHeader>
                <CardTitle>Case Summary & Strategy</CardTitle>
                <CardDescription>
                    Detailed case information used by AI for drafting and analysis.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Alert className="bg-blue-50 border-blue-200">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertTitle className="text-blue-800">AI Context</AlertTitle>
                    <AlertDescription className="text-blue-700">
                        The information provided here is critical for AI features. The more detailed the summary, the better the AI can assist with drafting and research.
                    </AlertDescription>
                </Alert>

                <div className="space-y-2">
                    <Label htmlFor="caseSummary">Case Summary * (Min 100 chars)</Label>
                    <Textarea
                        id="caseSummary"
                        placeholder="High-level overview: 'Client alleges breach of contract by defendant XYZ Corp. Defendant failed to pay $500K for services rendered under March 2024 agreement...'"
                        className="min-h-[150px]"
                        {...register('caseSummary', { required: true, minLength: 100 })}
                    />
                    <p className="text-xs text-muted-foreground text-right">{summary.length} characters</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="clientPosition">Client's Position</Label>
                        <Textarea
                            id="clientPosition"
                            placeholder="What the client wants and why..."
                            className="min-h-[100px]"
                            {...register('clientPosition')}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="opposingPosition">Opposing Party Position</Label>
                        <Textarea
                            id="opposingPosition"
                            placeholder="What the other side claims..."
                            className="min-h-[100px]"
                            {...register('opposingPartyPosition')}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="keyFacts">Key Facts</Label>
                    <Textarea
                        id="keyFacts"
                        placeholder="• Contract signed March 2024&#10;• Work completed June 2024&#10;• Payment due July 15, 2024"
                        className="min-h-[100px]"
                        {...register('keyFacts')} // Note: keyFacts is List[str] in backend, but Textarea returns string. I might need to transform it.
                    // For now, let's treat it as string in frontend and split it before submit or update backend to accept string.
                    // Backend `CaseBase` says `keyFacts: Optional[List[str]]`.
                    // I should probably change backend to `str` (text block) or handle splitting.
                    // Given it's a textarea, a string is better for MVP.
                    // I'll update backend schema later if needed, or split in `onSubmit`.
                    />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="legalIssues">Legal Issues</Label>
                        <Textarea
                            id="legalIssues"
                            placeholder="Core legal questions..."
                            className="min-h-[80px]"
                            {...register('legalIssues')}
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="space-y-2">
                            <Label htmlFor="prayer">Prayer / Relief Sought</Label>
                            <Textarea
                                id="prayer"
                                placeholder="Goal: Decree of Divorce, Money Recovery of ₹5 Lakhs..."
                                className="min-h-[80px]"
                                {...register('prayer')}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="strategyNotes">Case Strategy Notes (Internal)</Label>
                    <Textarea
                        id="strategyNotes"
                        placeholder="Advocate's strategic thinking..."
                        className="min-h-[100px] bg-yellow-50/50"
                        {...register('caseStrategyNotes')}
                    />
                </div>
            </CardContent>
        </Card>
    )
}
