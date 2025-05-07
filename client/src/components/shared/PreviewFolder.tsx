interface PreviewFolderProps {
  name?: string;
  onClick?: () => void;
}

function PreviewFolder({ name = "Carpeta", onClick }: PreviewFolderProps) {
    return (
        <div className="p-4 border rounded-md hover:bg-accent cursor-pointer" onClick={onClick}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="icon icon-tabler icons-tabler-outline icon-tabler-folder"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2" />
                    </svg>
                    <span>{name}</span>
                </div>
                <button
                    className="p-1 rounded-full hover:bg-gray-200 focus:outline-none"
                    aria-label="Opciones de carpeta"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Aquí puedes agregar la lógica para mostrar opciones
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="19" r="1" />
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default PreviewFolder;