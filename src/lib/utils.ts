import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistance, formatRelative } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string, formatStr: string = 'MMM dd, yyyy'): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return format(dateObj, formatStr)
}

export function formatRelativeDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return formatRelative(dateObj, new Date())
}

export function formatTimeAgo(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return formatDistance(dateObj, new Date(), { addSuffix: true })
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount)
}

export function formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '')
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3]
    }
    return phone
}

export function truncate(str: string, length: number = 50): string {
    if (str.length <= length) return str
    return str.slice(0, length) + '...'
}

export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function getInitials(name: string): string {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}
