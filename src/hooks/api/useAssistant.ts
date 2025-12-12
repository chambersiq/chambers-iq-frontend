import { useMutation } from '@tanstack/react-query'
import api from '@/lib/api'

interface ChatRequest {
    message: string
    threadId?: string
}

interface ChatResponse {
    response: string
    threadId: string
}

export function useAssistantChat() {
    return useMutation({
        mutationFn: async (data: ChatRequest) => {
            const { data: response } = await api.post<ChatResponse>('/ai/assistant/chat', data)
            return response
        }
    })
}
