import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface DashboardStats {
    activeClients: number;
    newClientsThisMonth: number;
    activeCases: number;
    newCasesThisWeek: number;
    documentsProcessed: number;
    newDocumentsThisWeek: number;
    aiDraftsCreated: number;
    newDraftsThisWeek: number;
    upcomingDeadlines: {
        id: string;
        title: string;
        date: string;
        type: string;
    }[];
    recentActivity: {
        id: string;
        type: string;
        title: string;
        subtitle: string;
        date: string;
        user: string;
    }[];
}

export function useDashboardStats(companyId: string) {
    return useQuery({
        queryKey: ['dashboard', companyId],
        queryFn: async () => {
            const { data } = await api.get<DashboardStats>(`/companies/${companyId}/dashboard`);
            return data;
        },
        enabled: !!companyId,
        staleTime: 5 * 60 * 1000, // 5 minutes cache
        refetchOnWindowFocus: true,
    });
}
