import React, { createRef } from "react";
import { fileservice, gitservice, localipfsstorage, resetFileSystem, Utils } from "../../App";
import ConfirmDelete from "../ConfirmDelete";

interface FileToolsProps {}

export const FileTools: React.FC<FileToolsProps> = ({}) => {
  let ModalRef = createRef<ConfirmDelete>();

  const clearAll = async () => {
    try {
      
      await ModalRef.current?.show()
      await fileservice.clearAll();
      Utils.log("yes");
    } catch (e) {
      Utils.log("no");
    }
  };

  return (
    <>
      <hr />
      <ConfirmDelete title={"Clear Files"} text={<div>This action will delete the files you are working on! Continue?</div>} ref={ModalRef}></ConfirmDelete>
      {/*         <button className="btn btn-danger w-10" onClick={async()=>fileservice.getDirectory("/")}>get dir</button> */}
      <button
        className="btn btn-danger w-10 d-none"
        onClick={async () => fileservice.syncFromBrowser()}
      >
        Sync from IDE
      </button>
      <button
        className="btn btn-primary w-10 ml-2"
        onClick={async () => fileservice.startNewRepo()}
      >
        Start new repo
      </button>{" "}
      <button
        className="btn btn-primary w-10 ml-2"
        onClick={async () => await gitservice.clearRepoName()}
      >
        Rename your repo
      </button> | 
      <button
        className="btn btn-danger w-10 ml-2"
        onClick={async () => await clearAll()}
      >
        Clear all files & git init
      </button>
      <button
        className="btn btn-danger w-10 ml-2 d-none"
        onClick={async () => {
          await fileservice.clearFilesInIde();
          Utils.log("done");
        }}
      >
        Clear files in IDE
      </button>
      {/*         <button className="btn btn-danger w-10 ml-2" onClick={async()=>fileservice.clearFilesInWorkingDirectory()}>Clear files in browser</button>
        <button className="btn btn-danger w-10 ml-2" onClick={async()=>fileservice.syncStart()}>sync start</button>

        <button className="btn btn-danger w-10" onClick={async()=>fileservice.showFiles()}>show files</button>

        <button className="btn btn-danger w-10" onClick={async()=>resetFileSystem()}>show config</button> */}
    </>
  );
};
