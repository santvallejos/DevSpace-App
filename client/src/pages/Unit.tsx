import React from 'react';
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Folder } from "@/models/FolderModel";
import PreviewFolder from "../components/shared/PreviewFolder";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useFolderStore } from '@/stores/FolderStore';
import { useResourceStore } from '@/stores/ResourceStore';
import Loading from '../components/shared/Loading';
import CardResource from '../components/shared/CardResource';

function MyUnit() {
  // Usar el store de carpetas
  const {
    folderCache,
    currentFolders,
    currentFolder,
    breadCrumbPath,
    isLoading: folderIsLoading,
    fetchFolder,
    fetchRootFolder,
    fetchSubFolders,
    buildBreadCrumbPath,
    setIsLoading: setFolderIsLoading
  } = useFolderStore();

  // Usar el store de recursos
  const {
    currentResourceFolder,
    isLoading: resourceIsLoading,
    fetchResourcesRoot,
    fetchResources,
    setIsLoading: setResourceIsLoading
  } = useResourceStore();

  // Combinar los estados de carga
  const isLoading = folderIsLoading || resourceIsLoading;

  const { folderId } = useParams<{ folderId: string }>();
  const navigate = useNavigate();

  const navigateToFolder = (folder: Folder) => { 
    navigate(`/unity/${folder.id}`); 
  };

  const navigateToRoot = () => { 
    navigate('/unity'); 
  };

  // Cargar las carpetas y recursos cuando cambia el ID de la carpeta en la URL
  useEffect(() => {
    const loadCurrentView = async () => {
      setFolderIsLoading(true);
      setResourceIsLoading(true);

      try {
        if (folderId) {
          // Estamos en una carpeta específica
          // 1. Cargar la carpeta actual
          const folder = await fetchFolder(folderId);

          if (folder) {
            // 2. Cargar las subcarpetas
            await fetchSubFolders(folder);
            
            // 3. Cargar los recursos de la carpeta
            await fetchResources(folderId);
            
            // 4. Construir el path de navegación
            await buildBreadCrumbPath(folderId);
            
            // 5. Actualizar la carpeta actual
            set({ currentFolder: folder });
          } else {
            // La carpeta no existe, redirigir a la raíz
            console.error(`La carpeta con ID ${folderId} no existe`);
            navigate('/unity');
          }
        } else {
          // Estamos en la raíz
          // 1. Cargar las carpetas de nivel raíz
          await fetchRootFolder();
          
          // 2. Cargar los recursos de la raíz
          await fetchResourcesRoot();
          
          // 3. Limpiar el path de navegación cuando estamos en la raíz
          set({ breadCrumbPath: [] });
        }
      } catch (error) {
        console.error("Error al cargar la vista actual:", error);
      } finally {
        setFolderIsLoading(false);
        setResourceIsLoading(false);
      }
    };

    loadCurrentView();
  }, [folderId, navigate]);

  return (
    <section className="p-5 w-full h-full flex flex-col flex-grow">
      {/* Header */}
      <div className="flex flex-col mb-6 pb-3 border-b">
        <div className="flex place-content-between">
          {/* Titulo */}
          <h1 className="text-2xl font-bold mb-3">Mi unidad</h1>

          <div className="flex items-center gap-2">
            {/* Buscar carpetas o recursos */}
            <div className="flex items-center border w-80 focus-within:border-indigo-500 transition duration-300 pr-3 gap-2 bg-white border-gray-500/30 h-[30px] rounded-[5px] overflow-hidden">
              <input
                type="text"
                placeholder="Buscar carpetas o recursos"
                className="w-full h-full pl-4 outline-none placeholder-gray-500 text-sm"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="22"
                height="22"
                viewBox="0 0 30 30"
                fill="#6B7280"
              >
                <path d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z"></path>
              </svg>
            </div>

            {/* Boton de crear carpeta o recurso */}
            <DropdownMenu>
              <DropdownMenuTrigger className="bg-blue-500 text-white px-4 py-0.5 rounded-md flex items-center cursor-pointer">
                <span className="mr-1 text-lg">+</span>Nuevo
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {/* Add Resource */}
                <DropdownMenuItem>
                  <Dialog>
                    <DialogTrigger onClick={(e) => e.stopPropagation()}>
                      Carpeta
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Agregar una carpeta</DialogTitle>
                        <DialogDescription>
                          Crea una nueva carpeta para organizar tus recursos.
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Dialog>
                    <DialogTrigger onClick={(e) => e.stopPropagation()}>
                      Recurso
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Agregar un recurso</DialogTitle>
                        <DialogDescription>
                          Agrega un nuevo recurso a tu unidad.
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Navegacion de la unidad (Breadcrumb) */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={navigateToRoot} className="cursor-pointer">
                start
              </BreadcrumbLink>
            </BreadcrumbItem>

            {breadCrumbPath.map((folder, index) => (
              <React.Fragment key={folder.id}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {index === breadCrumbPath.length - 1 ? (
                    <BreadcrumbPage>{folder.name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      onClick={() => navigate(`/unity/${folder.id}`)}
                      className="cursor-pointer"
                    >
                      {folder.name}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loading/>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Folders Section */}
          <div>
            {/* Titulo de las carpetas */}
            <h2 className="text-xl font-semibold mb-3">Carpetas</h2>
            {currentFolders.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {currentFolders.map((folder) => (
                  <div key={folder.id}>
                    <PreviewFolder
                      name={folder.name}
                      onClick={() => navigateToFolder(folder)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No hay carpetas en esta ubicación.</p>
            )}
          </div>

          {/* Resources Section */}
          <div>
            {/* Titulo de los recursos */}
            <h2 className="text-xl font-semibold mb-3">Recursos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {isLoading ? (
                <Loading/>
              ) : currentResourceFolder.length > 0 ? (
                currentResourceFolder.map((resource, index) => (
                  <CardResource
                    key={resource.id || index}
                    id={resource.id || ''}
                    name={resource.name || ''}
                    description={resource.description || ''}
                    type={resource.type}
                    url={resource.url || ''}
                    code={resource.code || ''}
                    text={resource.text || ''}
                    favorite={resource.favorite}
                  />
                ))
              ) : (
                <p className="text-gray-500">No hay recursos en esta ubicación.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default MyUnit;