import { ReadCommitResult } from "isomorphic-git";
import React from "react";
import { useBehaviorSubject } from "use-subscribable";
import { gitservice } from "../../../App";
import { default as dateFormat } from 'dateformat'
interface gitLogProps {}

export const GitLog: React.FC<gitLogProps> = ({}) => {
  const commits = useBehaviorSubject(gitservice.commits);

  gitservice.commits
    .subscribe((x) => {
      console.log(commits);
    })
    .unsubscribe();

  const getDate = (commit: ReadCommitResult) => {
    let date = dateFormat(commit.commit.committer.timestamp * 1000, "dddd, mmmm dS, yyyy, h:MM:ss TT");
    return date
  };

  return (
    <>

      <hr />
      <h4>Commits</h4>

      <div className="container-fluid">
        {commits?.map((commit) => {
          return (
            <div key={commit.oid} className="row p-1 small">
              <div className="col-2">{commit.commit.message}</div>
              <div className="col">{getDate(commit)}</div>
              <div className="col">{commit.oid}</div>
              <div
                onClick={async () => gitservice.checkout(commit.oid)}
                className="btn btn-primary btn-sm checkout-btn"
              >
                git checkout
              </div>
            </div>
          );
        })}
        <div
          onClick={async () => gitservice.checkout("master")}
          className="btn btn-primary btn-sm checkout-btn"
          data-oid="master"
        >
          git checkout master
        </div>
      </div>
    </>
  );
};
