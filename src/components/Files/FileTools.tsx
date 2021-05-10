import React, { createRef } from "react";
import { fileservice, gitservice, ipfservice, localipfsstorage, resetFileSystem, Utils } from "../../App";
import ConfirmDelete from "../ConfirmDelete"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArchive } from "@fortawesome/free-regular-svg-icons"
import { faCloudDownloadAlt } from "@fortawesome/free-solid-svg-icons"
interface FileToolsProps {}

export const FileTools: React.FC<FileToolsProps> = ({}) => {
  let ModalRef = createRef<ConfirmDelete>();

  const clearAll = async () => {
    try {  
      await ModalRef.current?.show()
      //Utils.log("yes");
    } catch (e) {
      //Utils.log("no");
    }
  };

  return (
    <>
      <div onClick={async ()=> gitservice.zip()} className='btn btn-primary mb-3'>download as zip <FontAwesomeIcon icon={faFileArchive}></FontAwesomeIcon></div><br></br>
      <div hidden onClick={async ()=> ipfservice.addAndOpenInVscode()} className='btn btn-primary'>clone in VSCode <FontAwesomeIcon icon={faCloudDownloadAlt}></FontAwesomeIcon></div>
    </>
  );
};
