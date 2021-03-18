import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo } from "@fortawesome/free-solid-svg-icons";

interface FileHelpProps {}

export const FileHelp: React.FC<FileHelpProps> = ({}) => {
  return (
    <div className="">
      <hr></hr>
      <div className="mt-4">
        <FontAwesomeIcon icon={faInfo} className="mr-2" />
        <br></br>
        In this section you can manage your files in git. Files from remix will
        be added automatically.<br></br>
      </div>
      <br></br>
      <br></br>
    </div>
  );
};
