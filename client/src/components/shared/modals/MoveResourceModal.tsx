import { useState, useEffect } from "react";
import { Resource, MoveResourceModel } from "@/models/resourceModel";
import { useFolderStore } from '@/stores/FolderStore';
import FolderTree from "@/components/shared/FolderTree";
import { 
    Move,
    X,
    AlertCircle,
    Folder,
    FolderOpen
} from "lucide-react";

interface MoveResourceModalProps {
    isOpen: boolean;
    onClose: () => void;
    resource: Resource | null;
    onMove: (id: string, moveData: MoveResourceModel) => Promise<void>;
}

function MoveResourceModal({ 
    isOpen, 
    onClose, 
    resource,
    onMove
}: MoveResourceModalProps) {
    const { folderSelected } = useFolderStore();
    const [isMoving, setIsMoving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Limpiar estado al cerrar
    useEffect(() => {
        if (!isOpen) {
            setError(null);
            setIsMoving(false);
        }
    }, [isOpen]);

    const handleMove = async () => {
        if (!resource) return;

        setIsMoving(true);
        setError(null);
        
        try {
            const moveData: MoveResourceModel = {
                folderId: folderSelected[0]?.id || null
            };

            await onMove(resource.id, moveData);
            onClose();
        } catch (error) {
            console.error("Error al mover el recurso:", error);
            setError("Error moving resource. Please try again.");
        } finally {
            setIsMoving(false);
        }
    };

    const handleClose = () => {
        if (!isMoving) {
            onClose();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape' && !isMoving) {
            onClose();
        }
        if (e.key === 'Enter' && e.ctrlKey) {
            handleMove();
        }
    };

    const getDestinationName = () => {
        return folderSelected[0]?.name || 'Raíz';
    };

    const getDestinationIcon = () => {
        return folderSelected[0] ? (
            <FolderOpen className="w-4 h-4 text-blue-500" />
        ) : (
            <Folder className="w-4 h-4 text-gray-500" />
        );
    };

    if (!isOpen || !resource) return null;

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
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={handleKeyDown}
                    tabIndex={-1}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <Move className="w-6 h-6 text-blue-500" />
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                    Move Resource
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Select destination folder for "{resource.name}"
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            disabled={isMoving}
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

                            {/* Destination Info */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                                <div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200 mb-2">
                                    <Move className="w-4 h-4" />
                                    <span className="font-medium">Selected destination:</span>
                                </div>
                                <div className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                                    {getDestinationIcon()}
                                    <span className="font-semibold">{getDestinationName()}</span>
                                </div>
                            </div>

                            {/* Folder Tree */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Select a folder:
                                </label>
                                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700/50 max-h-64 overflow-y-auto">
                                    <FolderTree />
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    💡 Click on a folder to select it as destination. If you don't select any, the resource will be moved to root.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col-reverse sm:flex-row gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <button
                            onClick={handleClose}
                            disabled={isMoving}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            Cancel
                        </button>
                        <button
                            onClick={handleMove}
                            disabled={isMoving}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <Move className="w-4 h-4" />
                            {isMoving ? 'Moving...' : 'Move Resource'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MoveResourceModal;
