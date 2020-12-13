import React from "react";
import { fileservice, gitservice } from "../../App";
import "./FileExplorer.css";
import { fileExplorerNode } from "./types";
interface FileButtonsProps {
  file: fileExplorerNode;
  setTab: (key:string) => void
}



export const FileButtons: React.FC<FileButtonsProps> = ({
  file,setTab
}: FileButtonsProps) => {

  const diffFile = (file:fileExplorerNode)=>{
    gitservice.diffFiles()
    ///setTab("diff")
  }

  if(file.type == "file"){
  return (
    <span className="status float-right mr-3 ml-3">
        
      <div className="badge badge-primary viewfile" onClick={async() => await fileservice.viewFile(file.fullname)}>
        edit
      </div>
      <div className="badge badge-primary addgit" onClick={async() => await gitservice.addToGit(file.fullname)}>
        add
      </div>
      {/* <div className="badge badge-primary addgit" onClick={async() => await gitservice.diffFile(file.fullname)}>
        diff
      </div> */}
      <div
        className="badge badge-primary checkoutfile d-none" onClick={async() => await gitservice.checkoutfile(file.fullname)}>
        checkout
      </div>
    </span>
  );
  }else{
      return <></>
  }
};
