import CardResource from "./ui/CardResource";
import { useState, useRef, useEffect } from "react";
import { Resource } from "@/models/resourceModel";
import { GetFavoriteResources, GetRecentsResources, GetRecommendedResources } from "@/services/resourcesServices";
import Loading from "./ui/loading";

function AppDashboard() {
  const buttonsDashboard = [
    {
      id: 1,
      name: "Recent Resources",
      activeSection: "recent",
      ref: useRef<HTMLButtonElement | null>(null)
    },
    {
      id: 2,
      name: "Favorites",
      activeSection: "favorites",
      ref: useRef<HTMLButtonElement | null>(null)
    },
    {
      id: 3,
      name: "Recommended",
      activeSection: "recommended",
      ref: useRef<HTMLButtonElement | null>(null)
    }
  ];

  // Estado para rastrear la sección activa
  const [activeSection, setActiveSection] = useState<"recent" | "recommended" | "favorites">("recent");
  const [indicatorStyle, setIndicatorStyle] = useState({});
  // Estado para almacenar los recursos favoritos
  const [favoriteResources, setFavoriteResources] = useState<Resource[]>([]);
  const [recentsResources, setRecentsResources] = useState<Resource[]>([]);
  const [recommendedResources, setRecommendedResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Estados para controlar si ya se cargaron los datos por primera vez
  const [favoritesLoaded, setFavoritesLoaded] = useState<boolean>(false);
  const [recentsLoaded, setRecentsLoaded] = useState<boolean>(false);

  // Actualizar la posición del indicador cuando cambia la sección activa
  useEffect(() => {
    const activeButton = buttonsDashboard.find(button => button.activeSection === activeSection)?.ref.current;
    if (activeButton) {
      setIndicatorStyle({
        left: `${activeButton.offsetLeft}px`,
        width: `${activeButton.offsetWidth}px`,
        transition: 'all 0.3s ease'
      });
    }
  }, [activeSection]);

  // Obtener los recursos favoritos del usuario
  const fetchFavoriteResources = async (forceReload = false) => {
    // Solo cargar si estamos en la sección de favoritos o si se fuerza la recarga
    if (activeSection === buttonsDashboard[1].activeSection || forceReload) {
      // Solo mostrar loading si es la primera carga o si se fuerza la recarga
      if (!favoritesLoaded || forceReload) {
        try {
          setIsLoading(true);
          const resources = await GetFavoriteResources();
          setFavoriteResources(resources);
          setFavoritesLoaded(true);
        } catch (error) {
          console.error("Error fetching favorite resources:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  // Obtener los recursos recomendados - siempre se recargan
  const fetchRecommendedResources = async () => {
    if (activeSection === buttonsDashboard[2].activeSection) {
      try {
        setIsLoading(true);
        const resources = await GetRecommendedResources();
        setRecommendedResources(resources);
      } catch (error) {
        console.error("Error fetching recommended resources:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  // Obtener los recursos recientes
  const fetchRecentsResources = async (forceReload = false) => {
    if (activeSection === buttonsDashboard[0].activeSection || forceReload) {
      // Solo mostrar loading si es la primera carga o si se fuerza la recarga
      if (!recentsLoaded || forceReload) {
        try {
          setIsLoading(true);
          const resources = await GetRecentsResources();
          setRecentsResources(resources);
          setRecentsLoaded(true);
        } catch (error) {
          console.error("Error fetching recents resources:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }
  }

  // Función para manejar la eliminación de un recurso
  const handleResourceDelete = async (resourceId: string) => {
    try
    {
      // Actualizar los estados locales para reflejar la eliminación inmediatamente
      setFavoriteResources(prev => prev.filter(resource => resource.id !== resourceId));
      setRecentsResources(prev => prev.filter(resource => resource.id !== resourceId));
      setRecommendedResources(prev => prev.filter(resource => resource.id !== resourceId));
      
      // No es necesario forzar una recarga completa después de la eliminación
      console.log(`Recurso con ID ${resourceId} eliminado de la interfaz`);
    } catch (error) {
      console.error("Error al eliminar el recurso:", error);
    }
  };

  useEffect(() => {
    // Cargar datos según la sección activa
    if (activeSection === "favorites") {
      fetchFavoriteResources();
    } else if (activeSection === "recent") {
      fetchRecentsResources();
    } else if (activeSection === "recommended") {
      // Recommended siempre se recarga
      fetchRecommendedResources();
    }
  }, [activeSection]);

  return (
    <>
      <section className="p-5">
        {/* titulo*/}
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-bold">Resource Dashboard</h1>
        </div>

        {/* Navegacion del dashboard*/}
        <div className="flex border-b mb-6 overflow-x-auto w-full relative">
          {buttonsDashboard.map((button) => (
            <button
              key={button.id}
              ref={button.ref}
              className={`px-4 py-2 text-sm ${activeSection === button.activeSection ? "font-medium" : "text-gray-500"} whitespace-nowrap`}
              onClick={() => setActiveSection(button.activeSection as "recent" | "recommended" | "favorites")}
            >
              {button.name}
            </button>
          ))}
          {/* Indicador animado */}
          <div className="absolute bottom-0 h-0.5 bg-blue-500" style={indicatorStyle} />
        </div>

        {/* Dashboard section */}
        {/* resource recent */}
        {activeSection === "recent" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {isLoading ? (
              <Loading/>
            ) : recentsResources.length > 0 ? (
              recentsResources.map((resource, index) => (
                <CardResource
                  key={resource.id || index}
                  id={resource.id || ''}
                  name={resource.name || ''}
                  folderName={resource.folderName || ''}
                  description={resource.description || ''}
                  type={resource.type}
                  url={resource.url || ''}
                  code={resource.code || ''}
                  text={resource.text || ''}
                  favorite={resource.favorite}
                  // Usar la nueva función de manejo de eliminación
                  onDelete={handleResourceDelete}
                />
              ))
            ) : (
              <p>No recents resources found.</p>
            )}
          </div>
        )}
        {/* resource recommended */}
        {activeSection === "recommended" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {isLoading ? (
              <Loading/>
            ) : recommendedResources.length > 0 ? (
              recommendedResources.map((resource, index) => (
                <CardResource
                  key={resource.id || index}
                  id={resource.id || ''}
                  name={resource.name || ''}
                  folderName={resource.folderName || ''}
                  description={resource.description || ''}
                  type={resource.type}
                  url={resource.url || ''}
                  code={resource.code || ''}
                  text={resource.text || ''}
                  favorite={resource.favorite}
                  // Usar la nueva función de manejo de eliminación
                  onDelete={handleResourceDelete}
                />
              ))
            ) : (
              <p>No recommended resources found.</p>
            )}
          </div>
        )}
        {/* resource favorites */}
        {activeSection === "favorites" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {isLoading ? (
              <Loading/>
            ) : favoriteResources.length > 0 ? (
              favoriteResources.map((resource, index) => (
                <CardResource
                  key={resource.id || index}
                  id={resource.id || ''}
                  name={resource.name || ''}
                  folderName={resource.folderName || ''}
                  description={resource.description || ''}
                  type={resource.type}
                  url={resource.url || ''}
                  code={resource.code || ''}
                  text={resource.text || ''}
                  favorite={resource.favorite}
                  // Usar la nueva función de manejo de eliminación
                  onDelete={handleResourceDelete}
                />
              ))
            ) : (
              <p>No favorite resources found.</p>
            )}
          </div>
        )}
      </section>
    </>
  )
}

export default AppDashboard;