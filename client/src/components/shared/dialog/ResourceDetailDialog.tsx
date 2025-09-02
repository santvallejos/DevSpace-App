import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
    Globe, 
    Code2, 
    FileText, 
    Star, 
    Copy, 
    ExternalLink, 
    Calendar,
    Edit3,
    Move,
    Trash2
} from "lucide-react";
import { Resource } from "@/models/resourceModel";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

interface ResourceDetailDialogProps {
    isOpen: boolean;
    onClose: () => void;
    resource: Resource | null;
    onEdit?: (resource: Resource) => void;
    onMove?: (resource: Resource) => void;
    onDelete?: (resource: Resource) => void;
    onToggleFavorite?: (resource: Resource) => void;
}

function ResourceDetailDialog({ 
    isOpen, 
    onClose, 
    resource,
    onEdit,
    onMove,
    onDelete,
    onToggleFavorite 
}: ResourceDetailDialogProps) {
    const [isCopied, setIsCopied] = useState(false);

    if (!resource) return null;

    // Función para obtener el icono según el tipo de recurso
    const getResourceIcon = () => {
        switch (resource.type) {
            case 0: return <Globe className="w-6 h-6 text-blue-500" />;
            case 1: return <Code2 className="w-6 h-6 text-green-500" />;
            case 2: return <FileText className="w-6 h-6 text-purple-500" />;
            default: return <FileText className="w-6 h-6 text-gray-500" />;
        }
    };

    // Función para obtener el nombre del tipo de recurso
    const getResourceTypeName = () => {
        switch (resource.type) {
            case 0: return "URL / Enlace";
            case 1: return "Código";
            case 2: return "Texto / Notas";
            default: return "Desconocido";
        }
    };

    // Función para obtener el nombre del lenguaje de programación
    const getCodeLanguage = () => {
        if (resource.type !== 1 || resource.codeType === undefined) return null;
        
        const codeTypeNames: { [key: number]: string } = {
            0: "HTML",
            1: "CSS", 
            2: "JavaScript",
            3: "TypeScript",
            4: "React",
            5: "Vue",
            6: "Angular",
            7: "Svelte",
            8: "PHP",
            9: "Python",
            10: "Java",
            11: "C#",
            12: "Ruby",
            13: "Go",
            14: "Rust",
            15: "SQL",
            16: "Markdown",
            17: "JSON"
        };
        
        return codeTypeNames[resource.codeType] || "Code";
    };

    // Función para formatear la fecha
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    };

    // Función para copiar el contenido
    const handleCopy = async () => {
        if (resource.value) {
            try {
                await navigator.clipboard.writeText(resource.value);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            } catch (error) {
                console.error('Error al copiar el texto:', error);
            }
        }
    };

    // Función para abrir enlace
    const handleOpenLink = () => {
        if (resource.type === 0 && resource.value) {
            const url = resource.value.startsWith('http') ? resource.value : `https://${resource.value}`;
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader className="space-y-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            {getResourceIcon()}
                            <div className="min-w-0 flex-1">
                                <DialogTitle className="text-xl font-semibold text-left flex items-center gap-2">
                                    {resource.name}
                                    {resource.favorite && (
                                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    )}
                                </DialogTitle>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600">
                                        {getResourceTypeName()}
                                    </span>
                                    {resource.type === 1 && getCodeLanguage() && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                            {getCodeLanguage()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {resource.description && (
                        <DialogDescription className="text-left text-base">
                            {resource.description}
                        </DialogDescription>
                    )}
                </DialogHeader>

                <div className="space-y-6">
                    {/* Contenido/Valor del recurso */}
                    {resource.value && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Contenido
                                </h3>
                                <div className="flex items-center gap-2">
                                    {resource.type === 0 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleOpenLink}
                                            className="h-8"
                                        >
                                            <ExternalLink className="w-4 h-4 mr-2" />
                                            Abrir
                                        </Button>
                                    )}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleCopy}
                                        className="h-8"
                                    >
                                        <Copy className="w-4 h-4 mr-2" />
                                        {isCopied ? 'Copiado' : 'Copiar'}
                                    </Button>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border">
                                <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 dark:text-gray-200 break-all">
                                    {resource.value}
                                </pre>
                            </div>
                        </div>
                    )}

                    <Separator />

                    {/* Información adicional */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Calendar className="w-4 h-4" />
                                <span>Fecha de creación</span>
                            </div>
                            <p className="text-sm font-medium">
                                {formatDate(resource.createdOn)}
                            </p>
                        </div>
                    </div>

                    <Separator />

                    {/* Acciones */}
                    <div className="flex flex-wrap gap-2 justify-end">
                        {onToggleFavorite && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onToggleFavorite(resource)}
                            >
                                <Star className={`w-4 h-4 mr-2 ${resource.favorite ? 'fill-current text-yellow-400' : ''}`} />
                                {resource.favorite ? 'Quitar favorito' : 'Agregar favorito'}
                            </Button>
                        )}
                        
                        {onEdit && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit(resource)}
                            >
                                <Edit3 className="w-4 h-4 mr-2" />
                                Editar
                            </Button>
                        )}
                        
                        {onMove && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onMove(resource)}
                            >
                                <Move className="w-4 h-4 mr-2" />
                                Mover
                            </Button>
                        )}
                        
                        {onDelete && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onDelete(resource)}
                                className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Eliminar
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ResourceDetailDialog;
