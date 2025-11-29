'use client'

import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Info } from 'lucide-react'

export function CaseSummarySection() {
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
                        required
                    />
                    <p className="text-xs text-muted-foreground text-right">0 characters</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="clientPosition">Client's Position</Label>
                        <Textarea
                            id="clientPosition"
                            placeholder="What the client wants and why..."
                            className="min-h-[100px]"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="opposingPosition">Opposing Party Position</Label>
                        <Textarea
                            id="opposingPosition"
                            placeholder="What the other side claims..."
                            className="min-h-[100px]"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="keyFacts">Key Facts</Label>
                    <Textarea
                        id="keyFacts"
                        placeholder="• Contract signed March 2024&#10;• Work completed June 2024&#10;• Payment due July 15, 2024"
                        className="min-h-[100px]"
                    />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="legalIssues">Legal Issues</Label>
                        <Textarea
                            id="legalIssues"
                            placeholder="Core legal questions..."
                            className="min-h-[80px]"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="desiredOutcome">Desired Outcome</Label>
                        <Textarea
                            id="desiredOutcome"
                            placeholder="Goal: Obtain judgment for $500K..."
                            className="min-h-[80px]"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="strategyNotes">Case Strategy Notes (Internal)</Label>
                    <Textarea
                        id="strategyNotes"
                        placeholder="Attorney's strategic thinking..."
                        className="min-h-[100px] bg-yellow-50/50"
                    />
                </div>
            </CardContent>
        </Card>
    )
}
