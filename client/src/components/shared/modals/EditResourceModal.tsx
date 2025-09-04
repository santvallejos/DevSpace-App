import { useState, useEffect } from "react";
import { Resource, UpdateResourceModel } from "@/models/resourceModel";
import { 
    Globe, 
    Code2, 
    FileText,
    Save,
    X,
    AlertCircle
} from "lucide-react";

interface EditResourceModalProps {
    isOpen: boolean;
    onClose: () => void;
    resource: Resource | null;
    onSave: (id: string, updatedResource: UpdateResourceModel) => Promise<void>;
}

function EditResourceModal({ 
    isOpen, 
    onClose, 
    resource,
    onSave
}: EditResourceModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [value, setValue] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Resetear los campos cuando cambie el recurso o se abra el modal
    useEffect(() => {
        if (isOpen && resource) {
            setName(resource.name || "");
            setDescription(resource.description || "");
            setValue(resource.value || "");
            setError(null);
        }
    }, [isOpen, resource]);

    // Limpiar campos al cerrar
    useEffect(() => {
        if (!isOpen) {
            setName("");
            setDescription("");
            setValue("");
            setError(null);
            setIsSaving(false);
        }
    }, [isOpen]);

    // Función para obtener el icono según el tipo de recurso
    const getResourceIcon = () => {
        if (!resource) return <FileText className="w-6 h-6 text-gray-500" />;
        
        switch (resource.type) {
            case 0: return <Globe className="w-6 h-6 text-blue-500" />;
            case 1: return <Code2 className="w-6 h-6 text-green-500" />;
            case 2: return <FileText className="w-6 h-6 text-purple-500" />;
            default: return <FileText className="w-6 h-6 text-gray-500" />;
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
            case 0: return "https://example.com";
            case 1: return "// Your code here...";
            case 2: return "Write your notes here...";
            default: return "Content...";
        }
    };

    // Función para obtener la etiqueta del campo de contenido
    const getValueLabel = () => {
        if (!resource) return "Content";
        
        switch (resource.type) {
            case 0: return "URL";
            case 1: return "Code";
            case 2: return "Text";
            default: return "Content";
        }
    };

    const handleSave = async () => {
        if (!resource || !name.trim()) {
            setError("Name is required");
            return;
        }

        setIsSaving(true);
        setError(null);
        
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
            setError("Error saving changes. Please try again.");
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
        if (e.key === 'Enter' && e.ctrlKey) {
            handleSave();
        }
    };

    if (!isOpen || !resource) return null;

    const isFormValid = name.trim().length > 0;

    return (
        <>
            {/* Overlay */}
            <div 
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={handleClose}
            />
            
            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div 
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={handleKeyDown}
                    tabIndex={-1}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            {getResourceIcon()}
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                    Edit {getResourceTypeName()}
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Modify your resource information
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            disabled={isSaving}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="space-y-6">
                            {/* Error Message */}
                            {error && (
                                <div className="flex items-center gap-2 p-3 text-sm text-red-800 bg-red-50 dark:text-red-200 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    {error}
                                </div>
                            )}

                            {/* Campo Nombre */}
                            <div className="space-y-2">
                                <label 
                                    htmlFor="edit-name" 
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    Name *
                                </label>
                                <input
                                    id="edit-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Resource name"
                                    disabled={isSaving}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>

                            {/* Campo Descripción */}
                            <div className="space-y-2">
                                <label 
                                    htmlFor="edit-description" 
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    Description
                                </label>
                                <input
                                    id="edit-description"
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Optional resource description"
                                    disabled={isSaving}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>

                            {/* Campo Contenido/Valor */}
                            <div className="space-y-2">
                                <label 
                                    htmlFor="edit-value" 
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    {getValueLabel()}
                                </label>
                                {resource.type === 1 ? (
                                    // Para código, usar textarea
                                    <textarea
                                        id="edit-value"
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                        placeholder={getValuePlaceholder()}
                                        disabled={isSaving}
                                        className="w-full min-h-[120px] px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                                        rows={6}
                                    />
                                ) : (
                                    // Para URL y texto, usar input
                                    <input
                                        id="edit-value"
                                        type="text"
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                        placeholder={getValuePlaceholder()}
                                        disabled={isSaving}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col-reverse sm:flex-row gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <button
                            onClick={handleClose}
                            disabled={isSaving}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!isFormValid || isSaving}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EditResourceModal;
