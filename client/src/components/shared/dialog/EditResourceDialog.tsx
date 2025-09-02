import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Resource, UpdateResourceModel } from "@/models/resourceModel";
import { 
    Globe, 
    Code2, 
    FileText,
    Save,
    X
} from "lucide-react";

interface EditResourceDialogProps {
    isOpen: boolean;
    onClose: () => void;
    resource: Resource | null;
    onSave: (id: string, updatedResource: UpdateResourceModel) => Promise<void>;
}

function EditResourceDialog({ 
    isOpen, 
    onClose, 
    resource,
    onSave
}: EditResourceDialogProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [value, setValue] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Resetear los campos cuando cambie el recurso o se abra el dialog
    useEffect(() => {
        if (isOpen && resource) {
            setName(resource.name || "");
            setDescription(resource.description || "");
            setValue(resource.value || "");
        }
    }, [isOpen, resource]);

    // Función para obtener el icono según el tipo de recurso
    const getResourceIcon = () => {
        if (!resource) return <FileText className="w-5 h-5 text-gray-500" />;
        
        switch (resource.type) {
            case 0: return <Globe className="w-5 h-5 text-blue-500" />;
            case 1: return <Code2 className="w-5 h-5 text-green-500" />;
            case 2: return <FileText className="w-5 h-5 text-purple-500" />;
            default: return <FileText className="w-5 h-5 text-gray-500" />;
        }
    };

    // Función para obtener el nombre del tipo de recurso
    const getResourceTypeName = () => {
        if (!resource) return "Recurso";
        
        switch (resource.type) {
            case 0: return "URL / Enlace";
            case 1: return "Código";
            case 2: return "Texto / Notas";
            default: return "Recurso";
        }
    };

    // Función para obtener el placeholder del campo de contenido
    const getValuePlaceholder = () => {
        if (!resource) return "Contenido...";
        
        switch (resource.type) {
            case 0: return "https://ejemplo.com";
            case 1: return "// Tu código aquí...";
            case 2: return "Escribe tus notas aquí...";
            default: return "Contenido...";
        }
    };

    // Función para obtener la etiqueta del campo de contenido
    const getValueLabel = () => {
        if (!resource) return "Contenido";
        
        switch (resource.type) {
            case 0: return "URL";
            case 1: return "Código";
            case 2: return "Texto";
            default: return "Contenido";
        }
    };

    const handleSave = async () => {
        if (!resource || !name.trim()) return;

        setIsSaving(true);
        try {
            const updatedResource: UpdateResourceModel = {
                name: name.trim(),
                description: description.trim() || undefined,
                value: value.trim() || undefined
            };

            await onSave(resource.id, updatedResource);
            onClose();
        } catch (error) {
            console.error("Error al actualizar el recurso:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleClose = () => {
        if (!isSaving) {
            onClose();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape' && !isSaving) {
            onClose();
        }
    };

    if (!resource) return null;

    const isFormValid = name.trim().length > 0;

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent 
                className="max-w-2xl max-h-[90vh] overflow-y-auto"
                onKeyDown={handleKeyDown}
            >
                <DialogHeader className="space-y-4">
                    <div className="flex items-center gap-3">
                        {getResourceIcon()}
                        <div>
                            <DialogTitle className="text-xl font-semibold text-left">
                                Editar {getResourceTypeName()}
                            </DialogTitle>
                            <DialogDescription className="text-left mt-1">
                                Modifica la información de tu recurso
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Campo Nombre */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-name" className="text-sm font-medium">
                            Nombre *
                        </Label>
                        <Input
                            id="edit-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nombre del recurso"
                            disabled={isSaving}
                            className="w-full"
                        />
                    </div>

                    {/* Campo Descripción */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-description" className="text-sm font-medium">
                            Descripción
                        </Label>
                        <Input
                            id="edit-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Descripción opcional del recurso"
                            disabled={isSaving}
                            className="w-full"
                        />
                    </div>

                    {/* Campo Contenido/Valor */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-value" className="text-sm font-medium">
                            {getValueLabel()}
                        </Label>
                        {resource.type === 1 ? (
                            // Para código, usar textarea
                            <textarea
                                id="edit-value"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                placeholder={getValuePlaceholder()}
                                disabled={isSaving}
                                className="w-full min-h-[120px] p-3 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical font-mono"
                                rows={6}
                            />
                        ) : (
                            // Para URL y texto, usar input
                            <Input
                                id="edit-value"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                placeholder={getValuePlaceholder()}
                                disabled={isSaving}
                                className="w-full"
                            />
                        )}
                    </div>
                </div>

                <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isSaving}
                        className="w-full sm:w-auto"
                    >
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!isFormValid || isSaving}
                        className="w-full sm:w-auto"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default EditResourceDialog;
