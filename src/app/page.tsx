'use client'

import { Button } from '@/components/ui/button'
import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'
import { Shield, Scale, FileText, Zap, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

function LandingPageContent() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const searchParams = useSearchParams()
    const error = searchParams.get('error')

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/dashboard')
        }
    }, [status, router])

    // useEffect(() => {
    //     if (error === 'AccessDenied') {
    //         toast.error("Access Denied", {
    //             description: "Your account is not registered. Please contact the administrator to onboard you.",
    //             duration: 5000,
    //         })
    //     }
    // }, [error])

    const handleLogin = () => {
        signIn('google', { callbackUrl: '/dashboard' })
    }

    // if (status === 'loading') {
    //     return <div className="flex h-screen items-center justify-center">Loading...</div>
    // }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Navigation */}
            <nav className="border-b bg-white px-6 py-4">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
                            <Scale className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-bold text-slate-900">Chambers IQ</span>
                    </div>
                    <Button onClick={handleLogin} disabled={status === 'loading'}>
                        {status === 'loading' ? 'Loading...' : 'Login'}
                    </Button>
                </div>
            </nav>

            {/* Error Alert */}
            {error === 'AccessDenied' && (
                <div className="mx-auto max-w-2xl px-6 mt-8">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Access Denied</AlertTitle>
                        <AlertDescription>
                            Your account is not registered. Please contact the administrator to onboard you.
                        </AlertDescription>
                    </Alert>
                </div>
            )}

            {/* Hero Section */}
            <main>
                <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
                    <div className="flex flex-col items-center text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
                            Legal Practice Management <br />
                            <span className="text-blue-600">Reimagined with AI</span>
                        </h1>
                        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                            Streamline your law firm's operations with intelligent case management,
                            automated document generation, and AI-powered insights.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Button size="lg" onClick={handleLogin} className="h-12 px-8 text-lg" disabled={status === 'loading'}>
                                {status === 'loading' ? 'Please wait...' : 'Get Started with Google'}
                            </Button>
                            <Button variant="outline" size="lg" className="h-12 px-8 text-lg">
                                Learn more
                            </Button>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="mx-auto mt-24 max-w-7xl px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="flex flex-col items-start">
                                <div className="rounded-lg bg-blue-50 p-3">
                                    <Shield className="h-6 w-6 text-blue-600" />
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-slate-900">Secure Case Management</h3>
                                <p className="mt-2 text-slate-600">
                                    Bank-grade security for your sensitive client data and case files.
                                </p>
                            </div>
                            <div className="flex flex-col items-start">
                                <div className="rounded-lg bg-blue-50 p-3">
                                    <FileText className="h-6 w-6 text-blue-600" />
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-slate-900">Smart Document Automation</h3>
                                <p className="mt-2 text-slate-600">
                                    Generate complex legal documents in seconds using AI templates.
                                </p>
                            </div>
                            <div className="flex flex-col items-start">
                                <div className="rounded-lg bg-blue-50 p-3">
                                    <Zap className="h-6 w-6 text-blue-600" />
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-slate-900">AI-Powered Insights</h3>
                                <p className="mt-2 text-slate-600">
                                    Get intelligent recommendations and analytics for your practice.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default function LandingPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LandingPageContent />
        </Suspense>
    )
}
