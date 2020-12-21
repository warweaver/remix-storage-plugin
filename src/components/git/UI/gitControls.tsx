import React, { useState } from "react";
import { useBehaviorSubject } from "use-subscribable";
import { gitservice } from "../../../App";
import { GitBranch } from "./gitBranch";
import { GitLog } from "./gitLog";

interface gitViewProps {}

export const GitControls: React.FC<gitViewProps> = ({}) => {
  const canCommit = useBehaviorSubject(gitservice.canCommit)
  const [message,setMessage] = useState({value:''})

  gitservice.canCommit.subscribe((x)=>{}).unsubscribe()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=> {
      setMessage({value:e.currentTarget.value})
  }

  const commitAllowed = ()=>{
    return canCommit === false || message.value ===""
  }

  return (
    <>
      <hr />
      {/* <button className="btn w-25 btn-primary" onClick={async () =>await gitservice.init()}>git init</button> */}

      {/* <button className="btn w-25 btn-primary" onClick={async()=>gitservice.addAll()} >git add all</button> */}
      <hr />
      <div className="form-group">
        <label>Message</label>
        <input className="form-control w-25" type="text" onChange={handleChange} value={message.value} />
      </div>
      {canCommit?<></>:<div className='alert alert-warning w-25'>Cannot commit in detached state! Create a new branch and check it out first or checkout master.<br></br></div>}
      <button className="btn w-25 btn-primary" disabled={commitAllowed()} onClick={async()=>gitservice.commit(message.value)} >git commit</button>
      <br /><hr />
      <GitLog/>
      <br /><hr />
      <GitBranch/>
    </>
  );
};
