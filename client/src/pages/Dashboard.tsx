import CardResource from "../components/shared/CardResource";
import CardResourceRecommended from "@/components/shared/CardResourceRecommended";
import { useState, useRef, useEffect } from "react";
import { useResourceStore } from "../stores/resourceStore";
import Loading from "../components/shared/Loading";

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

    // Usar el store de recursos
    const {
      recentsResources,
      favoritesResources,
      recommendedResources,
      fetchRecentResources,
      fetchFavoriteResources,
      fetchRecommendedResources,
      isLoading
    } = useResourceStore();

  // Estado para rastrear la sección activa
  const [activeSection, setActiveSection] = useState<"recent" | "recommended" | "favorites">("recent");
  const [indicatorStyle, setIndicatorStyle] = useState({});

  useEffect(() => {
    // Actualizar la posición del indicador cuando cambia la sección activa
    const activeButton = buttonsDashboard.find(button => button.activeSection === activeSection)?.ref.current;
    if (activeButton) {
      setIndicatorStyle({
        left: `${activeButton.offsetLeft}px`,
        width: `${activeButton.offsetWidth}px`,
        transition: 'all 0.3s ease'
      });
    }

    // Cargar datos según la sección activa
    if (activeSection === "favorites") {
      fetchFavoriteResources();
    } else if (activeSection === "recent") {
      fetchRecentResources();
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
                  description={resource.description || ''}
                  type={resource.type}
                  url={resource.url || ''}
                  code={resource.code || ''}
                  text={resource.text || ''}
                  favorite={resource.favorite}
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
                <CardResourceRecommended
                  key={resource.id || index}
                  name={resource.name || ''}
                  description={resource.description || ''}
                  type={resource.type}
                  url={resource.url || ''}
                  code={resource.code || ''}
                  text={resource.text || ''}
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
            ) : favoritesResources.length > 0 ? (
              favoritesResources.map((resource, index) => (
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
              <p>No favorite resources found.</p>
            )}
          </div>
        )}
      </section>
    </>
  )
}

export default AppDashboard;