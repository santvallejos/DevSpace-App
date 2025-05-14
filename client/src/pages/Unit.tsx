import React from 'react';
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Folder } from "@/models/FolderModel";
import { Resource } from "@/models/resourceModel";
import PreviewFolder from "../components/shared/PreviewFolder";
//import Loading from "./shared/Loading";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { GetFolderById, GetFoldersByParentFolderId } from '@/services/FolderServices';
import { GetResourceByFolderId } from '@/services/ResourceServices';
import Loading from '../components/shared/Loading';
import CardResource from '../components/shared/CardResource';

function MyUnit() {
  const [folderCache, setFolderCache] = useState<Record<string, Folder>>({});             // Estado para almacenar las carpetas en caché (solo las que se han cargado)
  const [currentFolders, setCurrentFolders] = useState<Folder[]>([]);                     // Estado para almacenar las carpetas actuales (las que se muestran)
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);                // Estado para almacenar la carpeta actual (si estamos dentro de una)
  const [breadcrumbPath, setBreadcrumbPath] = useState<Folder[]>([]);                     // Estado para almacenar la ruta de navegación (breadcrumb)
  const [isLoading, setIsLoading] = useState<boolean>(true);                              // Estado para controlar la carga
  const [currentResourceFolder, setCurrentResourceFolder] = useState<Resource[]>([]);     // Estado para almacenar los recursos de la carpeta actual

  const { folderId } = useParams<{ folderId: string }>(); // Obtener parámetros de la URL
  const navigate = useNavigate();

  /* ==================================================
    Cargar una carpeta específica por su ID
    ================================================== */
  const loadFolder = async (id: string): Promise<Folder | null> => {
    if (folderCache[id]) return folderCache[id];  // Si ya esta en caché, la devolvemos

    try {
      const folder = await GetFolderById(id);

      if (folder) {
        // Actualizar la caché con la nueva carpeta
        setFolderCache(prev => ({
          ...prev,
          [id]: folder
        }));
        return folder;
      }

      return null;
    } catch (error) {
      console.error(`Error al cargar la carpeta ${id}:`, error);
      return null;
    }
  };

  /* ==================================================
    Cargar las carpetas de nivel raíz 
    ================================================== */
  const loadRootFolders = async (): Promise<Folder[]> => {
    try {
      setIsLoading(true);

      // Pasamos un string vacío ya que null no funciona
      const allFolders = await GetFoldersByParentFolderId(""); 
      
      // Filtramos para obtener solo las carpetas de raíz (con parentFolderID null o vacío)
      const folderRoot = allFolders.filter(folder => 
        folder.parentFolderID === null || 
        folder.parentFolderID === "" || 
        folder.parentFolderID === undefined
      );

      // Actualizar la caché con las carpetas raíz
      const newCache = { ...folderCache };
      folderRoot.forEach(folder => {
        newCache[folder.id] = folder;
      });

      setFolderCache(newCache);
      console.log(folderRoot);
      return folderRoot;
    } catch (error) {
      console.error("Error al cargar las carpetas raíz:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  /* ==================================================
    Cargar los recursos de nivel raíz
    ================================================== */
  const loadRootResources = async (): Promise<Resource[]> => {
    try {
      setIsLoading(true);

      const resources = await GetResourceByFolderId("");

      setCurrentResourceFolder(resources);
      return resources;
    } catch (error) {
      console.error("Error al cargar los recursos de la carpeta raíz:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  /* ==================================================
    Cargar las subcarpetas de una carpeta específica
    ================================================== */
  const loadSubFolders = async (parentFolder: Folder): Promise<Folder[]> => {
    try {
      setIsLoading(true);

      if (!parentFolder.subFolders || parentFolder.subFolders.length === 0) return []; // Si no hay subcarpetas, devolvemos un array vacío

      // Cargar cada subcarpeta
      const subFolderPromises = parentFolder.subFolders.map(id => loadFolder(id));
      const subFolders = await Promise.all(subFolderPromises);

      return subFolders.filter((folder): folder is Folder => folder !== null); // Filtrar las carpetas nulas (por si alguna carga falló)
    } catch (error) {
      console.error(`Error al cargar las subcarpetas de ${parentFolder.id}:`, error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  /* ==================================================
    Cargar los recursos de una carpeta específica
    ================================================== */
  const loadResources = async (folderId: string | null): Promise<Resource[]> => {
    try {
      setIsLoading(true);
      const resources = await GetResourceByFolderId(folderId)

      setCurrentResourceFolder(resources);
      return resources;
    } catch (error) {
      console.error(`Error al cargar los recursos de la carpeta ${folderId}:`, error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }

  /* ==================================================
    Construccion del path de navegacion
    ================================================== */
  const buildBreadcrumbPath = async (currentFolderId: string | null): Promise<Folder[]> => {
    if (!currentFolderId) return []; // Si no hay Id devolvemos un array vacío

    const path: Folder[] = [];
    let currentId: string | null = currentFolderId;

    // Construir el path recursivamente desde la carpeta actual hasta la raíz
    while (currentId !== null) {
      // Intentar obtener la carpeta del caché primero
      const cachedFolder: Folder | undefined = folderCache[currentId];
      let folder: Folder | null = cachedFolder || null;

      // Si no está en caché, cargarla
      if (!folder) {
        folder = await loadFolder(currentId);
        if (!folder) break;
      }

      path.unshift(folder); // Añadir la carpeta al inicio del path (para mantener el orden correcto)
      currentId = folder.parentFolderID;
    }

    return path;
  };

  const navigateToFolder = (folder: Folder) => { navigate(`/unity/${folder.id}`); }; // Función para navegar a una carpeta

  const navigateToRoot = () => { navigate('/unity'); }; // Función para volver a la raíz

  /* **********************************************
    Cargar las carpetas cuando cambia el ID de la carpeta en la URL
    ********************************************** */
  useEffect(() => {
    const loadCurrentView = async () => {
      setIsLoading(true);

      try {
        if (folderId) {
          // Estamos en una carpeta específica
          // 1. Cargar la carpeta actual si no está en caché
          const cachedFolder: Folder | undefined = folderCache[folderId];
          let folder: Folder | null = cachedFolder || null;

          if (!folder) folder = await loadFolder(folderId);

          if (folder) {
            setCurrentFolder(folder);

            // 2. Cargar las subcarpetas
            const subFolders = await loadSubFolders(folder);
            setCurrentFolders(subFolders);

            // 3. Cagar los recursos de la carpeta
            const resources = await loadResources(folderId);
            setCurrentResourceFolder(resources); 

            // 4. Construir el path de navegación
            const path = await buildBreadcrumbPath(folderId);
            setBreadcrumbPath(path);
          } else {
            // La carpeta no existe, redirigir a la raíz
            console.error(`La carpeta con ID ${folderId} no existe`);
            navigate('/unity');
          }
        } else {
          // Estamos en la raíz
          setCurrentFolder(null);

          // Cargar las carpetas de nivel raíz
          const rootFolders = await loadRootFolders();
          setCurrentFolders(rootFolders);

          // Cargar los recursos de la raíz
          const rootResources = await loadRootResources();
          setCurrentResourceFolder(rootResources);

          setBreadcrumbPath([]);
        }
      } catch (error) {
        console.error("Error al cargar la vista actual:", error);
      } finally {
        setIsLoading(false);
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

            {breadcrumbPath.map((folder, index) => (
              <React.Fragment key={folder.id}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {index === breadcrumbPath.length - 1 ? (
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