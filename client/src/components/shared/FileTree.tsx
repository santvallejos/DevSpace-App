import { useEffect, useState } from "react";
import { Folder, Tree } from "../ui/FileTree";
import { GetFoldersByParentFolderId } from "@/services/FolderServices";
import { FolderModel } from "@/models/FolderModel";

function FolderTree(){
  const [rootFolders, setRootFolders] = useState<FolderModel[]>([]);

  const loadRootFodlders = async () =>{
    const data = await GetFoldersByParentFolderId("");
    setRootFolders(data);
    return data;
  }

  useEffect(() => {
    loadRootFodlders();
  }, []);

  return(
    <Tree
      className="overflow-hidden rounded-md bg-background p-2"
    >
      <Folder element="Unit" value="null">
        {rootFolders.map((rootFolders)=>
          <Folder element={rootFolders.name} value={rootFolders.id} key={rootFolders.id}>
          </Folder>
        )}
      </Folder>
    </Tree>
  )
}

export default FolderTree;