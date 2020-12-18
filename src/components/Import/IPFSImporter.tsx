import React, { useState } from "react";
import { useBehaviorSubject } from "use-subscribable";
import { ipfservice } from "../../App";

interface ipfsimporterProps {}

export const IPFSImporter: React.FC<ipfsimporterProps> = ({}) => {
  const [cid, setCID] = useState({ value: "" });
  const IPFSStatus = useBehaviorSubject(ipfservice.connectionStatus)

  ipfservice.connectionStatus.subscribe((x)=>{}).unsubscribe(); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCID({ value: e.currentTarget.value });
  };
  return (
    <>
      <div className="alert alert-warning" role="alert">
        Importing files will clear the filelist.
      </div>
      <div className="form-group">
        <label>IPFS CID</label>
        <input onChange={handleChange} className="form-control" type="text" id="ipfs" />
      </div>
      <div id="ipfsimportalert"></div>
      <button disabled={IPFSStatus?false:true} onClick={async()=>ipfservice.importFromCID(cid.value, cid.value)} className="btn w-25 btn-primary" id="clone-btn">
        import from IPFS
      </button>
      {IPFSStatus?<></>:<div className="alert alert-warning w-25 mt-2" role="alert">
        Your IPFS settings are incorrect. Unable to connect. Check your settings.
      </div>}
      <hr />
    </>
  );
};
