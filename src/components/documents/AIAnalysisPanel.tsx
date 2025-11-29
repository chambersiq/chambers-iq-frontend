'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sparkles, Users, Calendar, AlertCircle, FileText } from 'lucide-react'

export function AIAnalysisPanel() {
    return (
        <div className="h-full flex flex-col border-l bg-slate-50 w-[400px]">
            <div className="p-4 border-b bg-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold">AI Analysis</h3>
                </div>
                <Badge variant="success">Completed</Badge>
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="space-y-6">
                    {/* Summary */}
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium flex items-center gap-2">
                            <FileText className="h-4 w-4 text-slate-500" />
                            Document Summary
                        </h4>
                        <p className="text-sm text-slate-600 bg-white p-3 rounded-md border shadow-sm">
                            This document is a Complaint for Breach of Contract filed by John Smith against Acme Corp. It alleges failure to pay $500,000 for construction services rendered under the March 2024 agreement.
                        </p>
                    </div>

                    {/* Extracted Parties */}
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium flex items-center gap-2">
                            <Users className="h-4 w-4 text-slate-500" />
                            Identified Parties
                        </h4>
                        <div className="space-y-2">
                            <div className="bg-white p-3 rounded-md border shadow-sm text-sm">
                                <span className="font-semibold block">Plaintiff</span>
                                John Smith
                            </div>
                            <div className="bg-white p-3 rounded-md border shadow-sm text-sm">
                                <span className="font-semibold block">Defendant</span>
                                Acme Corp
                            </div>
                        </div>
                    </div>

                    {/* Key Dates */}
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-500" />
                            Key Dates
                        </h4>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between bg-white p-2 rounded-md border shadow-sm text-sm">
                                <span>Contract Signed</span>
                                <Badge variant="outline">Mar 15, 2024</Badge>
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded-md border shadow-sm text-sm">
                                <span>Breach Occurred</span>
                                <Badge variant="outline">Jul 15, 2024</Badge>
                            </div>
                        </div>
                    </div>

                    {/* Legal Issues */}
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-slate-500" />
                            Potential Issues
                        </h4>
                        <ul className="list-disc list-inside text-sm text-slate-600 bg-white p-3 rounded-md border shadow-sm space-y-1">
                            <li>Statute of Limitations (4 years for written contract)</li>
                            <li>Force Majeure clause applicability</li>
                            <li>Mitigation of damages</li>
                        </ul>
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}
