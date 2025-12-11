
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Shield, ShieldAlert, Settings, Crown, MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { User } from '@/types/user'
import { InviteMemberDialog } from './InviteMemberDialog'

// --- API Hooks ---
const useUsers = (companyId: string) => {
    return useQuery({
        queryKey: ['users', companyId],
        queryFn: async () => {
            const { data } = await api.get<User[]>(`/companies/${companyId}/users`)
            return data
        },
        enabled: !!companyId
    })
}

const useCreateUser = (companyId: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (userData: any) => {
            const { data } = await api.post(`/companies/${companyId}/users`, userData)
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users', companyId] })
        }
    })
}

const useUpdateUser = (companyId: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ email, data }: { email: string, data: Partial<User> }) => {
            const { data: res } = await api.put(`/users/${email}`, data)
            return res
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users', companyId] })
        }
    })
}

const useDeleteUser = (companyId: string) => {
    const queryClient = useQueryClient()
    const { user } = useAuth()

    return useMutation({
        mutationFn: async (email: string) => {
            if (!user?.email) throw new Error("Authentication required")
            await api.delete(`/users/${email}`, {
                headers: {
                    'X-User-Email': user.email
                }
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users', companyId] })
        }
    })
}

// --- Component ---

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function TeamManagement() {
    const { user: currentUser } = useAuth()
    const companyId = currentUser?.companyId || ''
    const { data: users = [], isLoading } = useUsers(companyId)
    const createUser = useCreateUser(companyId)
    const updateUser = useUpdateUser(companyId)
    const deleteUser = useDeleteUser(companyId)

    // Dialog State
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    // Delete Confirmation State
    const [userToDelete, setUserToDelete] = useState<User | null>(null)

    const handleOpenInvite = () => {
        setSelectedUser(null)
        setIsDialogOpen(true)
    }

    const handleOpenEdit = (user: User) => {
        setSelectedUser(user)
        setIsDialogOpen(true)
    }

    const handleSaveUser = async (data: any) => {
        setIsSaving(true)
        try {
            if (selectedUser) {
                // Update
                await updateUser.mutateAsync({ email: selectedUser.email, data })
            } else {
                // Create
                await createUser.mutateAsync(data)
            }
            setIsDialogOpen(false)
        } catch (error) {
            console.error("Failed to save user:", error)
            alert("Failed to save user. Check details and try again.")
        } finally {
            setIsSaving(false)
        }
    }

    const handleDeleteClick = (user: User) => {
        if (!currentUser?.email) {
            alert("You must be logged in to delete users.")
            return
        }
        setUserToDelete(user)
    }

    const confirmDelete = async () => {
        if (!userToDelete) return

        try {
            await deleteUser.mutateAsync(userToDelete.email)
            setUserToDelete(null)
        } catch (error: any) {
            console.error("Failed to delete:", error)
            const msg = error.response?.data?.detail || error.message || "Failed to delete user."
            alert(`Error: ${msg}`)
        }
    }

    if (isLoading) return <div>Loading team...</div>

    // Deduplicate users by email to prevent key warnings
    const uniqueUsers = Array.from(new Map(users.map(item => [item.email, item])).values())

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Team Members</h3>
                    <p className="text-sm text-slate-500">Manage access and roles for your firm.</p>
                </div>
                <Button onClick={handleOpenInvite}>
                    <Plus className="mr-2 h-4 w-4" /> Invite Member
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Client Access</TableHead>
                            <TableHead>Added On</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {uniqueUsers.map((user) => (
                            <TableRow key={user.email}>
                                <TableCell>
                                    <div className="font-medium">{user.name}</div>
                                    <div className="text-xs text-slate-500">{user.email}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {user.role === 'super_admin' ? (
                                            <>
                                                <Crown className="h-3 w-3 text-purple-600" />
                                                <span className="text-sm">Super Admin</span>
                                            </>
                                        ) : user.role === 'admin' ? (
                                            <>
                                                <ShieldAlert className="h-3 w-3 text-blue-500" />
                                                <span className="text-sm">Admin</span>
                                            </>
                                        ) : (
                                            <>
                                                <Shield className="h-3 w-3 text-slate-500" />
                                                <span className="text-sm">Advocate</span>
                                            </>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {user.role === 'super_admin' ? (
                                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                            Full Access (Super Admin)
                                        </Badge>
                                    ) : user.role === 'admin' ? (
                                        <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200">
                                            All Clients (Admin)
                                        </Badge>
                                    ) : (
                                        (!user.allowedClients || user.allowedClients.length === 0) ? (
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                All Clients
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary">
                                                {user.allowedClients.length} clients allowed
                                            </Badge>
                                        )
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="text-xs text-slate-500">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-slate-500 hover:text-blue-600"
                                            onClick={() => handleOpenEdit(user)}
                                            disabled={
                                                user.role === 'super_admin' ||
                                                (currentUser?.email === user.email)
                                            }
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-slate-500 hover:text-red-600"
                                            onClick={() => handleDeleteClick(user)}
                                            disabled={
                                                user.role === 'super_admin' ||
                                                (currentUser?.email === user.email)
                                            }
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {isDialogOpen && (
                <InviteMemberDialog
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    onSave={handleSaveUser}
                    initialData={selectedUser}
                    companyId={companyId}
                    isSaving={isSaving}
                />
            )}

            <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete
                            <span className="font-semibold text-slate-900"> {userToDelete?.name} </span>
                            and remove their access to the system.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault()
                                confirmDelete()
                            }}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {deleteUser.isPending ? 'Deleting...' : 'Delete User'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
