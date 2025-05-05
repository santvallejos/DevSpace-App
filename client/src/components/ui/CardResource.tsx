import { useState } from 'react';
import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
import { DeleteResource } from '@/services/resourcesServices';

interface ResourceProps {
    id: string
    name: string;
    folderName: string;
    description?: string;
    type: number;
    url: string;
    code?: string;
    text?: string;
    favorite: boolean;
    onDelete?: () => void;
}

function CardResource(props: ResourceProps) {
    //Propiedades que se tienen que pasar al recurso
    const { id, name, folderName, description, type, url, code, text, favorite } = props;
    const [isFavorite, setIsFavorite] = useState(favorite); // Estado para controlar si el recurso está marcado como favorito

    // Estados para el formulario de edición
    const [editName, setEditName] = useState(name);
    const [editDescription, setEditDescription] = useState(description || "");
    const [editUrl, setEditUrl] = useState(url);
    const [editCode, setEditCode] = useState(code || "");
    const [editText, setEditText] = useState(text || "");

    // Función para manejar el cambio de estado de favorito
    const handleFavoriteToggle = () => {
        setIsFavorite(!isFavorite);
    };

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
                                    defaultValue={url}
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
                            {code ? (
                                <pre className="whitespace-pre-wrap break-all">{code.length > 300 ? code.substring(0, 300) + "..." : code}</pre>
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
                            {text ? (
                                <p className="whitespace-pre-wrap break-all">{text.length > 300 ? text.substring(0, 300) + "..." : text}</p>
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

    const handleDeleteResource = async () => {
        try{
            await DeleteResource(id);
            if (props.onDelete) {
                props.onDelete();
            }
        } catch (error) {
            console.error("Error al eliminar el recurso:", error);
        }
    };

    return (
        <>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
                {/* Header Card: tittle and lavel */}
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold truncate max-w-[70%] dark:text-white" title={name}>{name}</h3>
                    <label className="flex justify-end relative cursor-pointer select-none">
                        <input
                            type="checkbox"
                            className="absolute opacity-0 cursor-pointer peer"
                            checked={isFavorite}
                            onChange={handleFavoriteToggle}
                        />
                        <svg
                            className="relative w-[30px] h-[30px] transition-all duration-300 fill-[#666] dark:fill-[#999] hover:scale-110 peer-checked:fill-[#ffeb49] dark:peer-checked:fill-[#ffeb49]"
                            height="24px"
                            id="Layer_1"
                            version="1.2"
                            viewBox="0 0 24 24"
                            width="24px"
                            xmlSpace="preserve"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                            <g><g><path d="M9.362,9.158c0,0-3.16,0.35-5.268,0.584c-0.19,0.023-0.358,0.15-0.421,0.343s0,0.394,0.14,0.521    c1.566,1.429,3.919,3.569,3.919,3.569c-0.002,0-0.646,3.113-1.074,5.19c-0.036,0.188,0.032,0.387,0.196,0.506    c0.163,0.119,0.373,0.121,0.538,0.028c1.844-1.048,4.606-2.624,4.606-2.624s2.763,1.576,4.604,2.625    c0.168,0.092,0.378,0.09,0.541-0.029c0.164-0.119,0.232-0.318,0.195-0.505c-0.428-2.078-1.071-5.191-1.071-5.191    s2.353-2.14,3.919-3.566c0.14-0.131,0.202-0.332,0.14-0.524s-0.23-0.319-0.42-0.341c-2.108-0.236-5.269-0.586-5.269-0.586    s-1.31-2.898-2.183-4.83c-0.082-0.173-0.254-0.294-0.456-0.294s-0.375,0.122-0.453,0.294C10.671,6.26,9.362,9.158,9.362,9.158z" /></g></g>
                        </svg>
                    </label>
                </div>

                {/* Folder */}
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 truncate" title={folderName}>
                    {folderName}
                </div>

                {/* Content Card: Resource Preview */}
                <div className="mb-4 flex">
                    {renderResourcePreview()}
                </div>

                {/* Footer Card: Buttons */}
                <div className="flex justify-between">
                    {/* Open */}
                    <Dialog>
                        <DialogTrigger>
                            Open
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{name}</DialogTitle>
                                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                    {folderName}
                                </div>
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
                                                    defaultValue={url}
                                                    readOnly
                                                />
                                            </div>
                                            <Button 
                                                type="button" 
                                                size="sm" 
                                                className="px-3 hover:bg-blue-500"
                                                onClick={() => navigator.clipboard.writeText(url)}
                                            >
                                                <span className="sr-only">Copy</span>
                                                <Copy />
                                            </Button>
                                            <Button
                                                type="button"
                                                size="sm"
                                                className="px-3 hover:bg-green-500"
                                                onClick={() => window.open(url, '_blank')}
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
                                                    {code || "// Code snippet not available"}
                                                </pre>
                                            </div>
                                            {code && (
                                                <button
                                                    className="mt-2 px-3 py-1 text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1"
                                                    onClick={() => navigator.clipboard.writeText(code)}
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
                                                    {text || "Text content not available"}
                                                </p>
                                            </div>
                                            {text && (
                                                <button
                                                    className="mt-2 px-3 py-1 text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1"
                                                    onClick={() => navigator.clipboard.writeText(text)}
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
                    <div className="flex space-x-2">
                        {/* Edit */}
                        <AlertDialog>
                            <AlertDialogTrigger className='text-base hover:text-yellow-500 dark:text-gray-300 dark:hover:text-yellow-400'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-edit"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" /><path d="M16 5l3 3" /></svg>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Edit Resource</AlertDialogTitle>
                                    <form className="space-y-4">
                                        {/* Name */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                required
                                            />
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Description
                                            </label>
                                            <textarea
                                                value={editDescription}
                                                onChange={(e) => setEditDescription(e.target.value)}
                                                className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                                                rows={3}
                                            />
                                        </div>

                                        {/* Resource Content based on type */}
                                        {type === 0 && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    URL
                                                </label>
                                                <input
                                                    type="url"
                                                    value={editUrl}
                                                    onChange={(e) => setEditUrl(e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                                                    required
                                                />
                                            </div>
                                        )}

                                        {type === 1 && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Code
                                                </label>
                                                <textarea
                                                    value={editCode}
                                                    onChange={(e) => setEditCode(e.target.value)}
                                                    className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono dark:bg-gray-700 dark:text-white resize-none"
                                                    rows={8}
                                                />
                                            </div>
                                        )}

                                        {type === 2 && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Text
                                                </label>
                                                <textarea
                                                    value={editText}
                                                    onChange={(e) => setEditText(e.target.value)}
                                                    className="w-full h-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                                                    rows={8}
                                                />
                                            </div>
                                        )}
                                    </form>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="btn btn-outline">Cancel</AlertDialogCancel>
                                    <AlertDialogAction className='hover:bg-blue-600 transition-colors'>Save</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        {/* Delete */}
                        <AlertDialog>
                            <AlertDialogTrigger className="text-base hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure you want to delete this resource?</AlertDialogTitle>
                                    <AlertDialogDescription>You are about to delete the resource <span className='font-bold text-black dark:text-white'>{name}</span>, it will remain in the trash for 30 days and then it will be automatically deleted.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel >Cancel</AlertDialogCancel>
                                    <AlertDialogAction className="btn btn-error hover:text-white hover:bg-red-500" onClick={handleDeleteResource}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CardResource;