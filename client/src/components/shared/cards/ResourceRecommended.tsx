import { Copy } from "lucide-react"
import { Button } from "@/components/shared/Button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog"

interface ResourceProps {
    name: string;
    description?: string;
    type: number;
    value: string
}

function CardResourceRecommended(props: ResourceProps) {
    //Propiedades que se tienen que pasar al recurso
    const { name, description, type, value} = props;
    // Evaluar que tipo de recurso es
    const renderResourcePreview = () => {
        switch (type) {
            case 0: // URL type
                return (
                    <div className="w-full">
                        <div className="flex items-center space-x-2">
                            <div className="grid flex-1 gap-2">
                                <Label htmlFor="link" className="sr-only">
                                    Link
                                </Label>
                                <Input
                                    id="link"
                                    defaultValue={value}
                                    readOnly
                                />
                            </div>
                            <Button type="submit" size="sm" className="px-3 hover:bg-blue-500">
                                <span className="sr-only">Copy</span>
                                <Copy />
                            </Button>
                        </div>
                    </div>
                );
            case 1: // Code type
                return (
                    <div className="border border-gray-200 dark:border-gray-700 rounded w-full bg-gray-50 dark:bg-gray-900 overflow-hidden">
                        <div className="p-3 text-sm font-mono text-gray-800 dark:text-gray-300 overflow-x-auto overflow-y-auto max-h-[100px] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                            {value ? (
                                <pre className="whitespace-pre-wrap break-all">{value.length > 300 ? value.substring(0, 300) + "..." : value}</pre>
                            ) : (
                                "// Code snippet not available"
                            )}
                        </div>
                    </div>
                );
            case 2: // Text type
                return (
                    <div className="border border-gray-200 dark:border-gray-700 rounded w-full bg-gray-50 dark:bg-gray-900 overflow-hidden">
                        <div className="p-3 text-sm text-gray-800 dark:text-gray-300 overflow-x-auto overflow-y-auto max-h-[100px] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                            {value ? (
                                <p className="whitespace-pre-wrap break-all">{value.length > 300 ? value.substring(0, 300) + "..." : value}</p>
                            ) : (
                                "Text content not available"
                            )}
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="border border-gray-200 dark:border-gray-700 rounded flex items-center w-full bg-gray-50 dark:bg-gray-900 p-3">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Resource preview not available</span>
                    </div>
                );
        }
    };

    return (
        <>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
                {/* Header Card: tittle and lavel */}
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold truncate max-w-[70%] dark:text-white" title={name}>{name}</h3>
                </div>

                {/* Content Card: Resource Preview */}
                <div className="mb-4 flex">
                    {renderResourcePreview()}
                </div>

                {/* Footer Card: Buttons */}
                <div className="flex justify-between">
                    {/* Open */}
                    <Dialog>
                        <DialogTrigger className="cursor-pointer">
                            Open
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{name}</DialogTitle>
                                <DialogDescription><span className="font-medium">Description:</span> {description || "No description available."}</DialogDescription>
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900 mb-4">
                                    {type === 0 && (
                                        <div className="flex items-center space-x-2">
                                            <div className="grid flex-1 gap-2">
                                                <Label htmlFor="link" className="sr-only">
                                                    Link
                                                </Label>
                                                <Input
                                                    id="link"
                                                    defaultValue={value}
                                                    readOnly
                                                />
                                            </div>
                                            <Button 
                                                type="button" 
                                                size="sm" 
                                                className="px-3 hover:bg-blue-500"
                                                onClick={() => navigator.clipboard.writeText(value)}
                                            >
                                                <span className="sr-only">Copy</span>
                                                <Copy />
                                            </Button>
                                            <Button
                                                type="button"
                                                size="sm"
                                                className="px-3 hover:bg-green-500"
                                                onClick={() => window.open(value, '_blank')}
                                            >
                                                <span className="sr-only">Visit</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                                    <polyline points="15 3 21 3 21 9"></polyline>
                                                    <line x1="10" y1="14" x2="21" y2="3"></line>
                                                </svg>
                                            </Button>
                                        </div>
                                    )}

                                    {type === 1 && (
                                        <div>
                                            <div className="font-medium mb-2 text-gray-700 dark:text-gray-300">Code Snippet</div>
                                            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded font-mono text-sm overflow-x-auto overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                                                <pre className="whitespace-pre-wrap break-all">
                                                    {value || "// Code snippet not available"}
                                                </pre>
                                            </div>
                                            {value && (
                                                <button
                                                    className="mt-2 px-3 py-1 text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1"
                                                    onClick={() => navigator.clipboard.writeText(value)}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                    Copy Code
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {type === 2 && (
                                        <div>
                                            <div className="font-medium mb-2 text-gray-700 dark:text-gray-300">Text Content</div>
                                            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm text-gray-800 dark:text-gray-300 overflow-x-auto overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                                                <p className="whitespace-pre-wrap break-all">
                                                    {value || "Text content not available"}
                                                </p>
                                            </div>
                                            {value && (
                                                <button
                                                    className="mt-2 px-3 py-1 text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1"
                                                    onClick={() => navigator.clipboard.writeText(value)}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                    Copy Text
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">
                                        Close
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </>
    );
}

export default CardResourceRecommended;