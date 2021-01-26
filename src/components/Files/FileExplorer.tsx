import React, { useState } from "react";
import { useBehaviorSubject } from "use-subscribable";
import { fileservice, gitservice, Utils } from "../../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFile,
  faFolder,
  faPlusSquare,
  faMinusSquare,
  faFolderPlus,
  faFolderMinus,
} from "@fortawesome/free-solid-svg-icons";
import "./FileExplorer.css";
import { fileExplorerNode } from "./types";
import { StatusButtons } from "./statuses";
import { FileButtons } from "./Buttons";

interface FileExplorerProps {
  setTab: (key: string) => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = (props) => {
  const files = useBehaviorSubject(fileservice.filetreecontent);
  const [fileVisibility, setfileVisibility] = useState<Record<string, boolean>>(
    {}
  );
  const [render, setRender] = useState({});

  fileservice.filetreecontent
    .subscribe((x) => {
      Utils.log("SUB FILES", files);
    })
    .unsubscribe();

  const getFileStatus = function (file: fileExplorerNode) {
    let result = fileservice.getFileStatusForFile(file.fullname || "");
    //Utils.log("file status", file, result);
    return <StatusButtons statuses={result} />;
  };

  const handleClick = async (files: fileExplorerNode) => {
    if (files.type !== "dir") {
      await fileservice.viewFile(files.fullname);
    } else {
      await toggleVisibility(files);
    }
  };

  const toggleVisibility = async (files: fileExplorerNode) => {
    let v = fileVisibility;
    files.collapse = !files.collapse;
    Utils.log("toggle", files);

    if (files.fullname && v) {
      v[files.fullname] = files.collapse;
      setfileVisibility(v);
      Utils.log(v);
      setRender({});
    }
  };

  const getVisisbilityForNode = (files: fileExplorerNode) => {
    let v = fileVisibility;
    if (files.fullname && v) {
      if (v[files.fullname]) {
        files.collapse = v[files.fullname];
      }
    }
    return files.collapse;
  };

  const renderChildren = function (files: fileExplorerNode) {
    return (
      <li className={`${files.type === "file" ? "fileborder" : ""}`}>
        {files.type === `dir` ? (
          <FontAwesomeIcon
            onClick={async () => await toggleVisibility(files)}
            icon={getVisisbilityForNode(files) ? faFolderPlus : faFolderMinus}
            style={{ cursor: "pointer" }}
          />
        ) : (
          <FontAwesomeIcon icon={faFile} />
        )}
        <span className="pr-1" />
        <span
          style={{ cursor: "pointer" }}
          onClick={async () => await handleClick(files)}
        >
          {files.name}
        </span>
        {files.type === `dir` ? (
          <span className="status float-right ml-3 diraddbutton pr-2">
            <div
              className={"badge badge-primary addgit w-100 text-left"}
              onClick={async () => await gitservice.addToGit(files.fullname)}
            >
              git add <FontAwesomeIcon icon={faFolder} /> {files.name}
            </div>
          </span>
        ) : (
          ""
        )}
        {(files || { children: [] }).children?.map((x: any) => {
          return (
            <ul
              className={`${files.collapse ? "d-none" : "d-block"}`}
              key={x.id}
              id="filetree"
            >
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
