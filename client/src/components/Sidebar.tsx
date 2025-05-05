import { Sidebar } from "@/components/ui/sidebar"
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ThemeToggle } from "./ui/theme-toggle";

function AppSidebar() {
    const location = useLocation();
    const [showCopyModal, setShowCopyModal] = useState(false);

    // Function to check if the path is active
    const isActive = (path: string) => {
        return location.pathname === path;
    }

    return (
        <>
        <Sidebar>
            <div className="flex flex-col h-full">
                <header className="p-4 flex justify-between items-center gap-x-2">
                    {/* Logo */}
                    <Link to="/" className="flex justify-between items-center gap-x-2">
                            <img src="icons/DevSpace-blue-icon.png" alt="" className="w-5 h-5" />
                            <h2 className="flex-none font-semibold text-2xl text-black focus:outline-hidden focus:opacity-80 dark:text-white">DevSpace</h2>
                    </Link>
                    {/* Theme toggle button */}
                    <ThemeToggle />
                    {/* Close sidebar */}
                    <div className="lg:hidden -me-2">
                        <button type="button" className="flex justify-center items-center gap-x-3 size-6 bg-white border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:hover:text-neutral-200 dark:focus:text-neutral-200" data-hs-overlay="#hs-sidebar-content-push">
                            <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            <span className="sr-only">Close</span>
                        </button>
                    </div>
                </header>
                {/* list of items */}
                <nav className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
                    <div className="hs-accordion-group pb-0 px-2 w-full flex flex-col items-center" data-hs-accordion-always-open>
                        <ul className="space-y-3 mt-5 w-full">
                            {/* Dashboard */}
                            <li>
                                <Link
                                    to="/"
                                    className={cn(
                                        "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg dark:text-white hover:bg-accent hover:text-accent-foreground",
                                        isActive("/") && "bg-accent text-accent-foreground"
                                    )}
                                >
                                    <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                                    Dashboard
                                </Link>
                            </li>
                            {/* Unit */}
                            <li className="hs-accordion">
                                <Link
                                    to="/unity"
                                    className={cn(
                                        "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg dark:text-white hover:bg-accent hover:text-accent-foreground",
                                        isActive("/unity") && "bg-accent text-accent-foreground"
                                    )}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-folder"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2" /></svg>
                                    My Unit
                                </Link>
                            </li>
                            {/* Trash */}
                            <li className="hs-accordion">
                                <Link
                                    to="/trash"
                                    className={cn(
                                        "flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg dark:text-white hover:bg-accent hover:text-accent-foreground",
                                        isActive("/delete") && "bg-accent text-accent-foreground"
                                    )}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                                    Trash
                                </Link>
                            </li>
                            {/* Insert or create copy */}
                            <li className="hs-accordion">
                                <button
                                    onClick={() => setShowCopyModal(true)}
                                    className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg dark:text-white w-full text-left hover:bg-accent hover:text-accent-foreground"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-folders"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 2a1 1 0 0 1 .707 .293l1.708 1.707h4.585a3 3 0 0 1 2.995 2.824l.005 .176v7a3 3 0 0 1 -3 3h-1v1a3 3 0 0 1 -3 3h-10a3 3 0 0 1 -3 -3v-9a3 3 0 0 1 3 -3h1v-1a3 3 0 0 1 3 -3zm-6 6h-1a1 1 0 0 0 -1 1v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1 -1v-1h-7a3 3 0 0 1 -3 -3z" /></svg>
                                    Insert or create copy
                                </button>
                            </li>
                        </ul>
                    </div>
                </nav>

                <footer className="mt-auto p-2 border-t border-gray-200 dark:border-neutral-700">
                    <div>
                        <ul className="flex justify-center mt-5 space-x-5">
                            {/* Github */}
                            <li>
                                <a
                                    className="text-gray-500 hover:text-gray-900 dark:hover:text-white dark:text-gray-400"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-brand-github"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" /></svg>
                                </a>
                            </li>
                            {/* LinkedIn */}
                            <li>
                                <a
                                    className="text-gray-500 hover:text-blue-400 dark:hover:text-white dark:text-gray-400"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-brand-linkedin"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M8 11v5" /><path d="M8 8v.01" /><path d="M12 16v-5" /><path d="M16 16v-3a2 2 0 1 0 -4 0" /><path d="M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4z" /></svg>
                                </a>
                            </li>
                            {/* Web site */}
                            <li>
                                <a
                                    className="text-gray-500 hover:text-yellow-300 dark:hover:text-white dark:text-gray-400"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-world"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M3.6 9h16.8" /><path d="M3.6 15h16.8" /><path d="M11.5 3a17 17 0 0 0 0 18" /><path d="M12.5 3a17 17 0 0 1 0 18" /></svg>
                                </a>
                            </li>
                        </ul>
                    </div>
                    {/* Contribuciones */}
                    <div className="flex justify-center mt-5 space-x-5">
                        <a href='https://cafecito.app/santvallejos' rel='noopener' target='_blank'><img srcSet='https://cdn.cafecito.app/imgs/buttons/button_5.png 1x, https://cdn.cafecito.app/imgs/buttons/button_5_2x.png 2x, https://cdn.cafecito.app/imgs/buttons/button_5_3.75x.png 3.75x' src='https://cdn.cafecito.app/imgs/buttons/button_5.png' alt='Invitame un café en cafecito.app' /></a>
                    </div>
                </footer>
            </div>

            {/* Modal to insert or create copy */}
            {showCopyModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-semibold mb-4">Insertar o Crear Copia</h2>
                        <div className="space-y-4">
                            <button
                                className="w-full p-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                                onClick={() => {/* Manejar crear copia */ }}
                            >
                                Crear una copia de tu unidad
                            </button>
                            <button
                                className="w-full p-3 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
                                onClick={() => {/* Manejar insertar unidad externa */ }}
                            >
                                Insertar unidad externa
                            </button>
                        </div>
                        <button
                            className="mt-4 w-full p-2 border border-input rounded-md hover:bg-accent"
                            onClick={() => setShowCopyModal(false)}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </Sidebar>
        </>
    )
}

export default AppSidebar;