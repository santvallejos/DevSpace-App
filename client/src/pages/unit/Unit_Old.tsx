import React from "react";
import { useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FolderModel } from "@/models/FolderModel";
import { useFolderStore } from "@/stores/FolderStore";
import { useResourceStore } from "@/stores/ResourceStore";
import PreviewFolder from "@/components/shared/cards/Folder";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Loading from '../../components/shared/loadings/Loading';
import CardResource from '@/components/shared/cards/Resource';
import Search from "@/components/shared/Search";
import CreateElment from "@/components/shared/CreateElement";

function MyUnit() {
  const renderTime = Date.now();
  console.log('🔄 UNIT: Renderizando en timestamp:', renderTime);
  
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
    fetchResourcesRoot,
    fetchResources,
  } = useResourceStore();

  // Memoizar las funciones del store para evitar que cambien en cada renderizado
  const stableFetchResources = useCallback(fetchResources, []);
  const stableFetchResourcesRoot = useCallback(fetchResourcesRoot, []);
  const stableFetchFolder = useCallback(fetchFolder, []);
  const stableFetchSubFolders = useCallback(fetchSubFolders, []);
  const stableFetchRootSubFolders = useCallback(fetchRootSubFolders, []);
  const stableBuildBreadCrumbPath = useCallback(buildBreadCrumbPath, []);
  const stableSetCurrentFolder = useCallback(setCurrentFolder, []);
  const stableSetCurrentFolders = useCallback(setCurrentFolders, []);
  const stableSetBreadCrumbPath = useCallback(setBreadCrumbPath, []);
  const stableSetIsLoading = useCallback(setIsLoading, []);

  // Memoizar la lista de recursos para evitar re-renderizados innecesarios
  const memoizedResources = React.useMemo(() => {
    console.log('🧠 MEMO: Recalculando recursos memoizados, cantidad:', currentResourceFolder.length);
    return currentResourceFolder;
  }, [currentResourceFolder]);

  const navigateToFolder = (folder: FolderModel) => { navigate(`/unity/${folder.id}`); }; //

  const navigateToRoot = () => { navigate('/unity'); }; // Función para volver a la raíz

  useEffect(() => {
    let isMounted = true;
    
    const loadCurrentView = async () => {
      if (!isMounted) return;
      
      setIsLoading(true);

      try {
        if (folderId) {
          const cachedFolder: FolderModel | undefined = folderCache[folderId];
          let folder: FolderModel | null = cachedFolder || null;

          if (!folder && isMounted) {
            folder = await fetchFolder(folderId);
          }

          if (folder && isMounted) {
            setCurrentFolder(folder);

            const subFolders = await fetchSubFolders(folder);
            if (isMounted) setCurrentFolders(subFolders);

            await fetchResources(folderId);

            const path = await buildBreadCrumbPath(folderId);
            if (isMounted) setBreadCrumbPath(path);
          } else if (isMounted) {
            console.error(`La carpeta con ID ${folderId} no existe`);
            navigate('/unity');
          }
        } else if (isMounted) {
          setCurrentFolder(null);

          const rootFolders = await fetchRootSubFolders();
          if (isMounted) setCurrentFolders(rootFolders);

          await fetchResourcesRoot();

          if (isMounted) setBreadCrumbPath([]);
        }
      } catch (error) {
        console.error("Error al cargar la vista actual:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    
    loadCurrentView();
    
    return () => {
      isMounted = false;
    };
  }, [folderId]);

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

            {/* Crear carpeta o recurso */}
            <CreateElment />
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
                      id={folder.id}
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
                    value={resource.value || ''}
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