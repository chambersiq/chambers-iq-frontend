'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, User as UserIcon, Bot, Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAssistantChat } from '@/hooks/api/useAssistant'
import ReactMarkdown from 'react-markdown'
import { cn } from '@/lib/utils'

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
}

export function ChatInterface() {
    // State
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState<Message[]>([])
    const [threadId, setThreadId] = useState<string | undefined>(undefined)

    // Refs
    const scrollRef = useRef<HTMLDivElement>(null)
    const endRef = useRef<HTMLDivElement>(null)

    // Mutation
    const chat = useAssistantChat()

    // Scroll to bottom effect
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, chat.isPending])

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!input.trim() || chat.isPending) return

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input
        }

        // Optimistic update
        setMessages(prev => [...prev, userMsg])
        setInput('')

        try {
            const result = await chat.mutateAsync({
                message: userMsg.content,
                threadId
            })

            // Update thread ID for session continuity
            if (result.threadId) {
                setThreadId(result.threadId)
            }

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: result.response
            }

            setMessages(prev => [...prev, aiMsg])

        } catch (error) {
            console.error(error)
            // Ideally show specific error or undo optimistic update
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I'm sorry, I encountered an error answering that. Please try again."
            }
            setMessages(prev => [...prev, errorMsg])
        }
    }

    return (
        <div className="flex flex-col h-full bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-6 max-w-3xl mx-auto">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4 opacity-50">
                            <div className="bg-blue-100 p-4 rounded-full">
                                <Sparkles className="h-8 w-8 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">Chambers IQ Assistant</h3>
                                <p className="text-sm text-slate-500 max-w-xs mx-auto">
                                    Ask about existing clients, cases, or create new ones. I can help manage your practice.
                                </p>
                            </div>
                        </div>
                    )}

                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex gap-4 w-full",
                                msg.role === 'user' ? "justify-end" : "justify-start"
                            )}
                        >
                            {msg.role === 'assistant' && (
                                <Avatar className="h-8 w-8 border bg-white mt-1">
                                    <AvatarFallback className="bg-blue-600 text-white"><Bot className="h-4 w-4" /></AvatarFallback>
                                </Avatar>
                            )}

                            <div
                                className={cn(
                                    "rounded-2xl px-5 py-3 text-sm max-w-[80%]",
                                    msg.role === 'user'
                                        ? "bg-blue-600 text-white"
                                        : "bg-white border shadow-sm text-slate-800"
                                )}
                            >
                                <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                                    <ReactMarkdown
                                        components={{
                                            // Override basic elements to match style if needed
                                            p: ({ node, ...props }) => <p className={cn("mb-2 last:mb-0")} {...props} />,
                                            ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2" {...props} />,
                                            ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2" {...props} />
                                        }}
                                    >
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                            </div>

                            {msg.role === 'user' && (
                                <Avatar className="h-8 w-8 border bg-white mt-1">
                                    <AvatarFallback className="bg-slate-200"><UserIcon className="h-4 w-4 text-slate-600" /></AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    ))}

                    {chat.isPending && (
                        <div className="flex gap-4 w-full justify-start">
                            <Avatar className="h-8 w-8 border bg-white mt-1">
                                <AvatarFallback className="bg-blue-600 text-white"><Bot className="h-4 w-4" /></AvatarFallback>
                            </Avatar>
                            <div className="bg-white border shadow-sm rounded-2xl px-4 py-3 flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                <span className="text-xs text-slate-500 font-medium">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={endRef} />
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 bg-white border-t">
                <div className="max-w-3xl mx-auto relative">
                    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your request (e.g., 'Find active cases for John Doe' or 'Create a new client')..."
                            className="bg-slate-50 border-slate-200 rounded-full pl-6 pr-12 py-6 focus-visible:ring-blue-500 focus-visible:ring-offset-0 shadow-sm"
                            disabled={chat.isPending}
                        />
                        <Button
                            type="submit"
                            size="icon"
                            disabled={!input.trim() || chat.isPending}
                            className={cn(
                                "absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-8 w-8 transition-all",
                                input.trim() ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-200 text-slate-400 hover:bg-slate-200"
                            )}
                        >
                            <Send className="h-4 w-4" />
                            <span className="sr-only">Send</span>
                        </Button>
                    </form>
                    <div className="text-xs text-center text-slate-400 mt-2">
                        AI can make mistakes. Please verify important client details.
                    </div>
                </div>
            </div>
        </div>
    )
}
