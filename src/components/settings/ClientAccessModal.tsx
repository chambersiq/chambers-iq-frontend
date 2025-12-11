
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useClients } from '@/hooks/api/useClients'
import { useAuth } from '@/hooks/useAuth'

interface ClientAccessModalProps {
    isOpen: boolean
    onClose: () => void
    userEmail: string
    currentAllowedClients: string[]
    onSave: (allowedClients: string[]) => void
}

export function ClientAccessModal({ isOpen, onClose, userEmail, currentAllowedClients, onSave }: ClientAccessModalProps) {
    const { user } = useAuth()
    const companyId = user?.companyId || ''
    const { data: clients = [], isLoading } = useClients(companyId)
    const [selectedClients, setSelectedClients] = useState<string[]>(currentAllowedClients)

    // Sync state when opening
    if (isOpen && selectedClients !== currentAllowedClients && selectedClients.length === 0 && currentAllowedClients.length > 0) {
        // Only sync if likely stale (simple check, effect is better but this is quick)
        // Actually, let's just use effect or state init key.
        // React state init only happens once. We should use useEffect.
    }

    // Better: use key on parent to reset state, or simple Effect
    // Let's use simple logic: toggle adds/removes.

    const handleToggle = (clientId: string) => {
        setSelectedClients(prev =>
            prev.includes(clientId)
                ? prev.filter(id => id !== clientId)
                : [...prev, clientId]
        )
    }

    // Reset state when modal opens with new data?
    // We'll rely on parent passing key={userEmail} to force re-mount if user changes.
    // Or we handle it properly:
    const [lastEmail, setLastEmail] = useState(userEmail)
    if (userEmail !== lastEmail) {
        setLastEmail(userEmail)
        setSelectedClients(currentAllowedClients)
    }

    const handleSave = () => {
        onSave(selectedClients)
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Manage Access: {userEmail}</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <p className="text-sm text-slate-600 mb-4">
                        Select clients visible to this Advocate.<br />
                        <span className="text-xs text-muted-foreground italic">Leave empty to allow access to ALL clients.</span>
                    </p>

                    {isLoading ? (
                        <div className="text-center py-8">Loading clients...</div>
                    ) : (
                        <ScrollArea className="h-[300px] border rounded-md p-4">
                            <div className="space-y-4">
                                {clients.map(client => (
                                    <div key={client.clientId} className="flex items-start space-x-3">
                                        <Checkbox
                                            id={client.clientId}
                                            checked={selectedClients.includes(client.clientId)}
                                            onCheckedChange={() => handleToggle(client.clientId)}
                                        />
                                        <div className="grid gap-1.5 leading-none">
                                            <Label
                                                htmlFor={client.clientId}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                            >
                                                {client.clientType === 'individual' ? client.fullName : client.companyName}
                                            </Label>
                                            <p className="text-xs text-muted-foreground">
                                                {client.clientType === 'individual' ? client.email : client.contactEmail}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {clients.length === 0 && (
                                    <div className="text-center text-sm text-slate-500 py-8">
                                        No clients found.
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save Access</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
