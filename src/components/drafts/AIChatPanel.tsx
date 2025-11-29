'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react'
import { ChatMessage } from '@/types/draft'
import { cn } from '@/lib/utils'

export function AIChatPanel() {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'Hello! I have reviewed the case details for Smith v. Jones. I can help you draft the Motion to Dismiss. What specific arguments would you like to focus on?',
            timestamp: new Date().toISOString()
        }
    ])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSend = () => {
        if (!input.trim()) return

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date().toISOString()
        }

        setMessages(prev => [...prev, userMsg])
        setInput('')
        setIsTyping(true)

        // Simulate AI response
        setTimeout(() => {
            const aiMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I've drafted a section based on the lack of subject matter jurisdiction. I've also cited the relevant precedent from the 9th Circuit. Would you like me to add that to the document?",
                timestamp: new Date().toISOString()
            }
            setMessages(prev => [...prev, aiMsg])
            setIsTyping(false)
        }, 1500)
    }

    return (
        <div className="flex flex-col h-full bg-slate-50 border-l">
            {/* Header */}
            <div className="p-4 border-b bg-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold">AI Assistant</h3>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={cn(
                            "flex gap-3 max-w-[90%]",
                            msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                        )}
                    >
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                            msg.role === 'user' ? "bg-blue-600 text-white" : "bg-purple-100 text-purple-600"
                        )}>
                            {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </div>
                        <div className={cn(
                            "p-3 rounded-lg text-sm",
                            msg.role === 'user'
                                ? "bg-blue-600 text-white rounded-tr-none"
                                : "bg-white border shadow-sm rounded-tl-none text-slate-700"
                        )}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                            <Bot className="h-4 w-4" />
                        </div>
                        <div className="bg-white border shadow-sm rounded-lg rounded-tl-none p-3 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75" />
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150" />
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t">
                <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex gap-2"
                >
                    <Input
                        placeholder="Ask AI to draft, edit, or research..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={!input.trim() || isTyping}>
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    )
}
