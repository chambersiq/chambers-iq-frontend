"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { MasterData } from '@/types/master-data';
import api from '@/lib/api';

interface MasterDataContextType {
    data: MasterData | null;
    isLoading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
}

const MasterDataContext = createContext<MasterDataContextType | undefined>(undefined);

export function MasterDataProvider({ children }: { children: React.ReactNode }) {
    const [data, setData] = useState<MasterData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Use the API client like other endpoints (includes auth headers)
            const response = await api.get('/master-data.json');
            const jsonData = response.data;

            if (jsonData.master_data) {
                setData(jsonData.master_data);
            } else {
                // Fallback for different JSON structure
                setData(jsonData.master_data || jsonData);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            console.error('Master Data Load Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <MasterDataContext.Provider value={{ data, isLoading, error, refresh: fetchData }}>
            {children}
        </MasterDataContext.Provider>
    );
}

export function useMasterData() {
    const context = useContext(MasterDataContext);
    if (context === undefined) {
        throw new Error('useMasterData must be used within a MasterDataProvider');
    }
    return context;
}
