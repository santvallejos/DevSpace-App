import React from "react";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FolderModel } from "@/models/FolderModel";
import { useFolderStore } from "@/stores/FolderStore";
import { useResourceStore } from "@/stores/ResourceStore";
import PreviewFolder from "@/components/shared/cards/Folder";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Loading from '../../components/shared/loadings/Loading';
import MinimalCardResource from '@/components/shared/cards/MinimalResource'; // Prueba de card
//import Search from "@/components/shared/Search";
import CreateElment from "@/components/shared/CreateElement";

function MyUnit() {
  const { folderId } = useParams<{ folderId: string }>();
  const navigate = useNavigate();

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

  const navigateToFolder = (folder: FolderModel) => { navigate(`/unity/${folder.id}`); };
  const navigateToRoot = () => { navigate('/unity'); };

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
    // Solo dependemos del folderId - las demás funciones son estables desde zustand
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folderId]);

  return (
    <section className="p-5 w-full h-full flex flex-col flex-grow">
      {/* Header */}
      <div className="flex flex-col mb-6 pb-3 border-b">
        <div className="flex place-content-between">
          <h1 className="text-2xl font-bold mb-3">Mi unidad</h1>
          <div className="flex items-center gap-2">
            {/* <Search /> */}
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
            <h2 className="text-xl font-semibold mb-3">Recursos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {currentResourceFolder.length > 0 ? (
                currentResourceFolder.map((resource, index) => (
                  <MinimalCardResource
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
