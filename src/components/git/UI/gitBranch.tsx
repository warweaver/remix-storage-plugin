import React, { useState } from "react";
import { Alert } from "react-bootstrap";
import { useBehaviorSubject } from "use-subscribable";
import { gitservice } from "../../../App";

interface gitBranchProps {}

export const GitBranch: React.FC<gitBranchProps> = ({}) => {
  const branches = useBehaviorSubject(gitservice.branches);
  const branch = useBehaviorSubject(gitservice.branch);
  const [newBranch,setNewBranch] = useState({value:''})
  let show:boolean = false

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=> {
      setNewBranch({value:e.currentTarget.value})
  }

  gitservice.branches
    .subscribe((x) => {
      console.log(branches);
      if(branches){
        show = (branches.length>0)
      }
    })
    .unsubscribe();

  gitservice.branch
    .subscribe((x) => {
      console.log(branch);
    })
    .unsubscribe();

  return (
    <>
    <div className={show?"":"d-none"}>
      <h4>Branches</h4>
      <Alert className="w-50" variant="success">
        {branch}
      </Alert>
      {branches?.map((branch) => {
        return (
          <div key={branch} className="row p-1">
            <div className="col-2">{branch}</div>
            <div className="col">
              <span className="float-right">
                <div
                  onClick={async () => gitservice.checkout(branch)}
                  className="btn btn-primary btn-sm checkout-btn"
                >
                  checkout
                </div>
              </span>
            </div>
          </div>
        );
      })}
      <hr />
      <h4>Create branch</h4>
      <div className="form-group">
        <label>Branchname</label>
        <input onChange={handleChange} className="form-control w-25" type="text" id="newbranchname" />
      </div>
      <button onClick={async()=>gitservice.createBranch(newBranch.value)} className="btn w-25 btn-primary" id="createbranch-btn">
        git branch
      </button>
      </div>
    </>
  );
};
