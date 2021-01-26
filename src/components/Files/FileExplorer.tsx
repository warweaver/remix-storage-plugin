import React from "react";
import { useBehaviorSubject } from "use-subscribable";
import { fileservice } from "../../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faFolder } from "@fortawesome/free-solid-svg-icons";
import "./FileExplorer.css";
import { fileExplorerNode } from "./types";
import { StatusButtons } from "./statuses";
import { FileButtons } from "./Buttons";

interface FileExplorerProps {
  setTab: (key: string) => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = (props) => {
  const files = useBehaviorSubject(fileservice.filetreecontent);

  fileservice.filetreecontent
    .subscribe((x) => {
      Utils.log(files);
    })
    .unsubscribe();

  const getFileStatus = function (file: fileExplorerNode) {
    let result = fileservice.getFileStatusForFile(file.fullname || "");
    //Utils.log("file status", file, result);
    return <StatusButtons statuses={result} />;
  };

  const renderChildren = function (files: fileExplorerNode) {
    return (
      <li className={`${files.type === "file" ? "fileborder" : ""}`}>
        {files.type === `dir` ? (
          <FontAwesomeIcon icon={faFolder} />
        ) : (
          <FontAwesomeIcon icon={faFile} />
        )}
        <span className="pr-1" />
        {files.name}

        {(files || { children: [] }).children?.map((x: any) => {
          return (
            <ul className={`${files.collapse ? "d-none" : "d-block"}`} key={x.id} id="filetree">
              {renderChildren(x)}
            </ul>
          );
        })}

        <FileButtons setTab={props.setTab} file={files} />
        {getFileStatus(files)}
      </li>
    );
  };

  return (
    <>
      {(files || { children: [] }).children?.map((x: any) => {
        return (
          <ul className="mw-50 basefiletree" key={x.id} id="filetree">
            {renderChildren(x)}
          </ul>
        );
      })}
    </>
  );
};
