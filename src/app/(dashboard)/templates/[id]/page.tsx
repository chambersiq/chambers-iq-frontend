import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TemplateEditor } from '@/components/templates/TemplateEditor'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function EditTemplatePage({ params }: { params: { id: string } }) {
    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-4">
                    <Link href="/templates">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="flex-1">
                        <Input
                            className="text-lg font-semibold border-none shadow-none px-0 h-auto focus-visible:ring-0"
                            defaultValue="Retainer Agreement"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                    </Button>
                </div>
            </div>

            {/* Editor */}
            <TemplateEditor />
        </div>
    )
}
