import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Crown, Shield, ShieldAlert } from 'lucide-react'
import { useClients } from '@/hooks/api/useClients'
import { User } from '@/types/user'

interface InviteMemberDialogProps {
    isOpen: boolean
    onClose: () => void
    onSave: (data: any) => Promise<void>
    initialData?: User | null
    companyId: string
    isSaving?: boolean
}

export function InviteMemberDialog({
    isOpen,
    onClose,
    onSave,
    initialData,
    companyId,
    isSaving
}: InviteMemberDialogProps) {
    const isEditing = !!initialData
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [role, setRole] = useState('advocate')
    const [allowedClients, setAllowedClients] = useState<string[]>([])

    // Fetch clients for selection
    const { data: clients = [] } = useClients(companyId)

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setName(initialData.name)
                setEmail(initialData.email)
                setRole(initialData.role)
                setAllowedClients(initialData.allowedClients || [])
            } else {
                setName('')
                setEmail('')
                setRole('advocate')
                setAllowedClients([])
            }
        }
    }, [isOpen, initialData])

    const handleSave = async () => {
        await onSave({
            name,
            email,
            role,
            allowedClients
        })
    }

    const toggleClient = (clientId: string) => {
        setAllowedClients(prev => {
            if (prev.includes(clientId)) {
                return prev.filter(id => id !== clientId)
            } else {
                return [...prev, clientId]
            }
        })
    }

    const isAllAccess = allowedClients.length === 0

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Member' : 'Invite New Member'}</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input
                                placeholder="John Doe"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Email Address</Label>
                            <Input
                                placeholder="john@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                disabled={isEditing} // Email matches ID, usually immutable
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Role</Label>
                        <Select
                            value={role}
                            onValueChange={setRole}
                            disabled={initialData?.role === 'super_admin'}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin">
                                    <div className="flex items-center gap-2">
                                        <ShieldAlert className="h-4 w-4 text-blue-500" />
                                        <span>Admin (Full Access)</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="advocate">
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-slate-500" />
                                        <span>Advocate (Restricted Access)</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {role === 'advocate' && (
                        <div className="space-y-3 pt-2 border-t">
                            <div className="flex items-center justify-between">
                                <Label>Client Access</Label>
                                {isAllAccess ? (
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                        All Clients
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary">
                                        {allowedClients.length} Selected
                                    </Badge>
                                )}
                            </div>

                            <p className="text-xs text-slate-500">
                                Select specific clients to restrict access. Leave empty to allow access to ALL clients.
                            </p>

                            <ScrollArea className="h-[200px] border rounded-md p-2">
                                <div className="space-y-2">
                                    {clients.map(client => (
                                        <div key={client.clientId} className="flex items-center space-x-2 p-1 hover:bg-slate-50 rounded">
                                            <Checkbox
                                                id={client.clientId}
                                                checked={allowedClients.includes(client.clientId)}
                                                onCheckedChange={() => toggleClient(client.clientId)}
                                            />
                                            <label
                                                htmlFor={client.clientId}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                                            >
                                                {client.clientType === 'individual' ? client.fullName : client.companyName}
                                                <span className="text-xs text-slate-400 ml-2 font-normal">
                                                    {client.clientType === 'individual' ? client.email : client.contactEmail}
                                                </span>
                                            </label>
                                        </div>
                                    ))}
                                    {clients.length === 0 && (
                                        <div className="text-center py-8 text-sm text-slate-400">
                                            No clients found.
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? 'Saving...' : (isEditing ? 'Save Changes' : 'Send Invite')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
