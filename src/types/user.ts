export interface User {
    userId: string
    companyId: string
    email: string
    name: string
    role: string // 'super_admin' | 'admin' | 'advocate'
    allowedClients?: string[] // if empty/undefined -> all access (unless logic changes app-side)
    status: string
    createdAt: string
    updatedAt?: string
}
