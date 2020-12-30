import React, { useEffect } from "react";
import { useBehaviorSubject } from "use-subscribable";
import { fileservice } from "../../../App";

interface GitStatusProps {}

export const GitStatus: React.FC<GitStatusProps> = ({}) => {
  const files = useBehaviorSubject(fileservice.filetreecontent);
  let staged = 0;
  let untracked = 0;
  let deleted = 0;
  let show = false
  fileservice.filetreecontent
    .subscribe((x) => {
      console.log("GIT STATUS", files);
      staged = fileservice.getFilesByStatus("staged");
      untracked = fileservice.getFilesByStatus("untracked");
      deleted = fileservice.getFilesByStatus("deleted");
      show = (deleted>0 || staged>0 ||  untracked>0)

    })
    .unsubscribe();

  useEffect(() => {}, []);

  return (
    <>
    {show?
    <>
    <hr></hr>
    <h4>Git status</h4>
    <div className="alert alert-success">
      {staged > 0 ? <div>{staged} staged</div> : <></>}
      {untracked > 0 ? <div>{untracked} untracked</div> : <></>}
      {deleted > 0 ? <div>{deleted} deleted</div> : <></>}
    </div></>
    :<></>}
    </>
  );
};
