import React, { useEffect } from "react";
import { useBehaviorSubject } from "use-subscribable";
import { fileservice } from "../../../App";

interface GitStatusProps {}

export const GitStatus: React.FC<GitStatusProps> = ({}) => {
  const files = useBehaviorSubject(fileservice.filetreecontent);
  let staged = 0;
  let untracked = 0;
  let deleted = 0;
  let modified = 0;
  let show = false
  fileservice.filetreecontent
    .subscribe((x) => {
      console.log("GIT STATUS", files);
      staged = fileservice.getFilesByStatus("staged");
      untracked = fileservice.getFilesByStatus("untracked");
      deleted = fileservice.getFilesByStatus("deleted");
      modified = fileservice.getFilesByStatus("modified");
      show = (deleted>0 || staged>0 ||  untracked>0 || modified>0)

    })
    .unsubscribe();

  useEffect(() => {}, []);

  return (
    <>
    {show?
    <>
    <hr></hr>
    <div>Git status</div>
    <div className="alert alert-success">
      {staged > 0 ? <div>{staged} staged</div> : <></>}
      {modified > 0 ? <div>{modified} modified</div> : <></>}
      {untracked > 0 ? <div>{untracked} untracked</div> : <></>}
      {deleted > 0 ? <div>{deleted} deleted</div> : <></>}
    </div></>
    :<></>}
    </>
  );
};
