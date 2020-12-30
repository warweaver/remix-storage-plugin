import React, { createRef } from "react";
import { fileservice, localipfsstorage, resetFileSystem } from "../../App";
import ConfirmDelete from "../ConfirmDelete";

interface FileToolsProps {}

export const FileTools: React.FC<FileToolsProps> = ({}) => {
  let ModalRef = createRef<ConfirmDelete>();

  const clearAll = async () => {
    try {
      await ModalRef.current?.show();
      fileservice.clearAll();
      console.log("yes");
    } catch (e) {
      console.log("no");
    }
  };

  return (
    <>
      <hr />
      <ConfirmDelete ref={ModalRef}></ConfirmDelete>
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
      |
      <button
        className="btn btn-danger w-10 ml-2"
        onClick={async () => await clearAll()}
      >
        Clear all files & git init
      </button>
      <button
        className="btn btn-danger w-10 ml-2"
        onClick={async () => {
          await fileservice.clearFilesInIde();
          console.log("done");
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
