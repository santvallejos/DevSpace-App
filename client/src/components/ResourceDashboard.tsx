import CardResource from "./ui/CardResource";
import { useState, useRef, useEffect } from "react";
import { Resource } from "@/models/resourceModel";
import { GetFavoriteResources } from "@/services/resourcesServices";

function AppDashboard(){
    // Estado para rastrear la sección activa
    const [activeSection, setActiveSection] = useState<"recent" | "recommended" | "favorites">("recent");
    const [indicatorStyle, setIndicatorStyle] = useState({});
    // Estado para almacenar los recursos favoritos
    const [favoriteResources, setFavoriteResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    // Definir el tipo para las referencias de botones
    const buttonRefs = {
        recent: useRef<HTMLButtonElement | null>(null),
        recommended: useRef<HTMLButtonElement | null>(null),
        favorites: useRef<HTMLButtonElement | null>(null)
    };
    
    // Actualizar la posición del indicador cuando cambia la sección activa
    useEffect(() => {
        const activeButton = buttonRefs[activeSection].current;
        if (activeButton) {
            setIndicatorStyle({
                left: `${activeButton.offsetLeft}px`,
                width: `${activeButton.offsetWidth}px`,
                transition: 'all 0.3s ease'
            });
        }
    }, [activeSection]);

    // Obtener los recursos favoritos del usuario
    const fetchFavoriteResources = async () => {
      if (activeSection === "favorites") {
          try {
              setIsLoading(true);
              const resources = await GetFavoriteResources();
              setFavoriteResources(resources);
          } catch (error) {
              console.error("Error fetching favorite resources:", error);
          } finally {
              setIsLoading(false);
          }
      }
  };

    useEffect(() => {
        fetchFavoriteResources();
    }, [activeSection]);

    return(
        <>
        <section className="p-5">
          {/* section title */}
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-2xl font-bold">Resource Dashboard</h1>
          </div>
          {/* Navigation buttons on the dashboard */}
          <div className="flex border-b mb-6 overflow-x-auto w-full relative">
            <button 
              ref={buttonRefs.recent}
              className={`px-4 py-2 text-sm ${activeSection === "recent" ? "font-medium" : "text-gray-500"} whitespace-nowrap`}
              onClick={() => setActiveSection("recent")}
            >
              Recent Resources
            </button>
            <button 
              ref={buttonRefs.favorites}
              className={`px-4 py-2 text-sm ${activeSection === "favorites" ? "font-medium" : "text-gray-500"} whitespace-nowrap`}
              onClick={() => setActiveSection("favorites")}
            >
              Favorites
            </button>
            <button 
              ref={buttonRefs.recommended}
              className={`px-4 py-2 text-sm ${activeSection === "recommended" ? "font-medium" : "text-gray-500"} whitespace-nowrap`}
              onClick={() => setActiveSection("recommended")}
            >
              Recommended
            </button>
            {/* Indicador animado */}
            <div className="absolute bottom-0 h-0.5 bg-blue-500" style={indicatorStyle}/>
          </div>

          {/* Dashboard section */}
          {/* resource recent */}
          {activeSection === "recent" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            </div>
          )}
          {/* resource recommended */}
          {activeSection === "recommended" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            </div>
          )}
          {/* resource favorites */}
          {activeSection === "favorites" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {isLoading ? (
                <div className="col-span-full flex justify-center items-center py-10">
                  <svg 
                    className="w-16 h-16" 
                    fill="hsl(228, 97%, 42%)" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g><circle cx="12" cy="3" r="1"><animate id="spinner_7Z73" begin="0;spinner_tKsu.end-0.5s" attributeName="r" calcMode="spline" dur="0.6s" values="1;2;1" keySplines=".27,.42,.37,.99;.53,0,.61,.73"/></circle><circle cx="16.50" cy="4.21" r="1"><animate id="spinner_Wd87" begin="spinner_7Z73.begin+0.1s" attributeName="r" calcMode="spline" dur="0.6s" values="1;2;1" keySplines=".27,.42,.37,.99;.53,0,.61,.73"/></circle><circle cx="7.50" cy="4.21" r="1"><animate id="spinner_tKsu" begin="spinner_9Qlc.begin+0.1s" attributeName="r" calcMode="spline" dur="0.6s" values="1;2;1" keySplines=".27,.42,.37,.99;.53,0,.61,.73"/></circle><circle cx="19.79" cy="7.50" r="1"><animate id="spinner_lMMO" begin="spinner_Wd87.begin+0.1s" attributeName="r" calcMode="spline" dur="0.6s" values="1;2;1" keySplines=".27,.42,.37,.99;.53,0,.61,.73"/></circle><circle cx="4.21" cy="7.50" r="1"><animate id="spinner_9Qlc" begin="spinner_Khxv.begin+0.1s" attributeName="r" calcMode="spline" dur="0.6s" values="1;2;1" keySplines=".27,.42,.37,.99;.53,0,.61,.73"/></circle><circle cx="21.00" cy="12.00" r="1"><animate id="spinner_5L9t" begin="spinner_lMMO.begin+0.1s" attributeName="r" calcMode="spline" dur="0.6s" values="1;2;1" keySplines=".27,.42,.37,.99;.53,0,.61,.73"/></circle><circle cx="3.00" cy="12.00" r="1"><animate id="spinner_Khxv" begin="spinner_ld6P.begin+0.1s" attributeName="r" calcMode="spline" dur="0.6s" values="1;2;1" keySplines=".27,.42,.37,.99;.53,0,.61,.73"/></circle><circle cx="19.79" cy="16.50" r="1"><animate id="spinner_BfTD" begin="spinner_5L9t.begin+0.1s" attributeName="r" calcMode="spline" dur="0.6s" values="1;2;1" keySplines=".27,.42,.37,.99;.53,0,.61,.73"/></circle><circle cx="4.21" cy="16.50" r="1"><animate id="spinner_ld6P" begin="spinner_XyBs.begin+0.1s" attributeName="r" calcMode="spline" dur="0.6s" values="1;2;1" keySplines=".27,.42,.37,.99;.53,0,.61,.73"/></circle><circle cx="16.50" cy="19.79" r="1"><animate id="spinner_7gAK" begin="spinner_BfTD.begin+0.1s" attributeName="r" calcMode="spline" dur="0.6s" values="1;2;1" keySplines=".27,.42,.37,.99;.53,0,.61,.73"/></circle><circle cx="7.50" cy="19.79" r="1"><animate id="spinner_XyBs" begin="spinner_HiSl.begin+0.1s" attributeName="r" calcMode="spline" dur="0.6s" values="1;2;1" keySplines=".27,.42,.37,.99;.53,0,.61,.73"/></circle><circle cx="12" cy="21" r="1"><animate id="spinner_HiSl" begin="spinner_7gAK.begin+0.1s" attributeName="r" calcMode="spline" dur="0.6s" values="1;2;1" keySplines=".27,.42,.37,.99;.53,0,.61,.73"/></circle><animateTransform attributeName="transform" type="rotate" dur="6s" values="360 12 12;0 12 12" repeatCount="indefinite"/></g>
                  </svg>
                </div>
              ) : favoriteResources.length > 0 ? (
                favoriteResources.map((resource, index) => (
                  <CardResource
                    key={resource.id || index} 
                    id={resource.id || ''}
                    name={resource.name || ''} 
                    folderName={resource.folderName || ''}
                    description={resource.description || ''}
                    type={resource.type }
                    url={resource.url || ''}
                    code={resource.code || ''}
                    text={resource.text || ''}
                    favorite={resource.favorite}
                    // Cuando se elimina un recursos recargamos la lista de favoritos
                    onDelete={fetchFavoriteResources}
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