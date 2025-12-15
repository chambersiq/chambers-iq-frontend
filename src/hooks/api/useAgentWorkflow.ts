import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface WorkflowState {
    thread_id: string;
    status: string; // "running", "interrupted_for_human", "completed"
    current_node: string;
    current_state: any;
}

export function useStartWorkflow() {
    return useMutation({
        mutationFn: async (payload: { case_id: string, document_type: string, client_id: string, template_content?: string, company_id?: string }) => {
            const { data } = await api.post<WorkflowState>('/workflows/start', payload);
            return data;
        },
    });
}

export function useWorkflowStatus(threadId: string | null) {
    return useQuery({
        queryKey: ['workflow', threadId],
        queryFn: async () => {
            const { data } = await api.get<WorkflowState>(`/workflows/${threadId}/status`);
            return data;
        },
        enabled: !!threadId,
        refetchInterval: (query) => {
            const status = query.state.data?.status;
            // Poll every 2s if running, stop if completed or interrupted
            return status === 'running' ? 2000 : false;
        }
    });
}

export function useResumeWorkflow() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ threadId, verdict, feedback }: { threadId: string, verdict: string, feedback?: string }) => {
            const { data } = await api.post<WorkflowState>(`/workflows/${threadId}/resume`, {
                human_verdict: verdict,
                human_feedback: feedback
            });
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['workflow', data.thread_id] });
        }
    });
}
