import React from "react";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FolderModel } from "@/models/FolderModel";
import { useFolderStore } from "@/stores/FolderStore";
import { useResourceStore } from "@/stores/resourceStore";
import PreviewFolder from "@/components/shared/PreviewFolder";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Loading from '../components/shared/Loading';
import CardResource from '../components/shared/CardResource';
import Search from "@/components/shared/Search";
import { Input } from "@/components/ui/input";
import FolderTree from "@/components/shared/FileTree";

function MyUnit() {
  const { folderId } = useParams<{ folderId: string }>(); //Obtener parametos de la URL
  const navigate = useNavigate(); //Navegacion entre paginas

  const {
    isLoading,
    breadCrumbPath,
    currentFolders,
    folderCache,
    setCurrentFolder,
    setCurrentFolders,
    setBreadCrumbPath,
    setIsLoading,
    fetchFolder,
    fetchRootSubFolders,
    fetchSubFolders,
    buildBreadCrumbPath
  } = useFolderStore();

  const {
    currentResourceFolder,
    setCurrentResourceFolder,
    fetchResourcesRoot,
    fetchResources,
  } = useResourceStore();

  const navigateToFolder = (folder: FolderModel) => { navigate(`/unity/${folder.id}`); }; //

  const navigateToRoot = () => { navigate('/unity'); }; // Función para volver a la raíz

  useEffect(() => {
    const loadCurrentView = async () => {
      setIsLoading(true);

      try {
        if (folderId) {
          // Si el folderId existe, significa que estamos en una carpeta específica

          const cachedFolder: FolderModel | undefined = folderCache[folderId];
          let folder: FolderModel | null = cachedFolder || null;

          if (!folder) folder = await fetchFolder(folderId);

          if (folder) {
            setCurrentFolder(folder);

            // Cargar las subcarpetas
            const subFolders = await fetchSubFolders(folder);
            setCurrentFolders(subFolders);

            // Cargar los recursos
            const resources = await fetchResources(folderId);
            setCurrentResourceFolder(resources);

            // Construir el path
            const path = await buildBreadCrumbPath(folderId);
            setBreadCrumbPath(path);
          } else {
            console.error(`La carpeta con ID ${folderId} no existe`);
            navigate('/unity');
          }
        } else {
          //Estamos en la raiz
          setCurrentFolder(null);

          // Cargar las carpetas de nivel raiz
          const rootFolders = await fetchRootSubFolders();
          setCurrentFolders(rootFolders);

          // Cargar los recursos de nivel raiz
          const rootResources = await fetchResourcesRoot();
          setCurrentResourceFolder(rootResources);

          setBreadCrumbPath([]);
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
            <Search />

            {/* Boton de crear carpeta o recurso */}
            <DropdownMenu>
              <DropdownMenuTrigger className="bg-blue-500 text-white px-4 py-0.5 rounded-md flex items-center cursor-pointer">
                <span className="mr-1 text-lg">+</span>Nuevo
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {/* Add Resource */}
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="w-full text-left" onClick={() => {
                        // Cerrar el dropdown al abrir el dialog
                        document.body.click();
                      }}>
                        Carpeta
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle>Agregar una carpeta</DialogTitle>
                      <DialogDescription>
                        Crea una nueva carpeta para organizar tus recursos.
                      </DialogDescription>
                      <DialogHeader>
                        <Input type="text" placeholder="Name Folder"/>
                        <br />
                        <span>Selecciona donde guardar la carpeta</span>
                        <FolderTree />
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="w-full text-left" onClick={() => {
                        // Cerrar el dropdown al abrir el dialog
                        document.body.click();
                      }}>
                        Recurso
                      </button>
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
          <Loading />
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
                <Loading />
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
};

export default MyUnit;