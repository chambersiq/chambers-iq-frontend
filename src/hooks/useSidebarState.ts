import { useState, useEffect } from 'react'

export function useSidebarState() {
    // Initialize with false (expanded) by default
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        // Load from localStorage on mount
        const saved = localStorage.getItem('sidebar_collapsed')
        if (saved !== null) {
            setIsCollapsed(saved === 'true')
        }
        setIsLoaded(true)
    }, [])

    const toggle = () => {
        const newState = !isCollapsed
        setIsCollapsed(newState)
        localStorage.setItem('sidebar_collapsed', String(newState))
    }

    return { isCollapsed, toggle, isLoaded }
}
