import { useEffect, useState } from "react";
import { Folder, Tree } from "../ui/FileTree";
import { GetAllFolders } from "@/services/FolderServices";
import { FolderModel } from "@/models/FolderModel";
import { useFolderStore } from "@/stores/FolderStore";

// Agregamos una extensión del modelo
interface FolderModelWithChildren extends FolderModel {
  children: FolderModelWithChildren[];
}

function FolderTree() {
  const {
    setFolderSelected,
  } = useFolderStore();

  const [folderTree, setFolderTree] = useState<FolderModelWithChildren[]>([]);

  // Función para construir el árbol jerárquico
  const buildTree = (flatFolders: FolderModel[]): FolderModelWithChildren[] => {
    const folderMap = new Map<string, FolderModelWithChildren>();

    flatFolders.forEach(folder => {
      folderMap.set(folder.id, { ...folder, children: [] });
    });

    const tree: FolderModelWithChildren[] = [];

    flatFolders.forEach(folder => {
      if (folder.parentFolderID) {
        const parent = folderMap.get(folder.parentFolderID);
        const current = folderMap.get(folder.id);
        if (parent && current) {
          parent.children.push(current);
        }
      } else {
        const current = folderMap.get(folder.id);
        if (current) tree.push(current);
      }
    });

    return tree;
  };

  // Render recursivo del árbol
  const renderFolders = (folders: FolderModelWithChildren[]) => {
    return folders.map(folder => (
      <Folder key={folder.id} element={folder.name} value={folder.id} onClick={(e) => setFolderSelected(e, folder.name, folder.id)}>
        {folder.children.length > 0 && renderFolders(folder.children)}
      </Folder>
    ));
  };

  useEffect(() => {
    const loadAndBuildTree = async () => {
      const flatFolders = await GetAllFolders();
      const tree = buildTree(flatFolders);
      setFolderTree(tree);
    };

    loadAndBuildTree();
  }, []);

  return (
    <Tree
      className="overflow-hidden rounded-md bg-background p-2"
      initialExpandedItems={["null"]}
      initialSelectedId="null"
    >
      <Folder element="Unit" value="null" onClick={(e) => setFolderSelected(e, "Unit", "")}>
        {renderFolders(folderTree)}
      </Folder>
    </Tree>
  );
}

export default FolderTree;