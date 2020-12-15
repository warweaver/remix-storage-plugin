import React, { useState } from "react";
import { gitservice } from "../../App";
import { GitBranch } from "./gitBranch";
import { GitLog } from "./gitLog";

interface gitViewProps {}

export const GitControls: React.FC<gitViewProps> = ({}) => {

  const [message,setMessage] = useState({value:''})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=> {
      setMessage({value:e.currentTarget.value})
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
      <button className="btn w-25 btn-primary" onClick={async()=>gitservice.commit(message.value)} >git commit</button>
      <br /><hr />
      <GitLog/>
      <br /><hr />
      <GitBranch/>
    </>
  );
};
