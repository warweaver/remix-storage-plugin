import React, { useState } from "react";
import { toast } from "react-toastify";
import { useBehaviorSubject } from "../usesubscribe/index";
import { ipfservice } from "../../App";

interface IPFSConfigProps {}

export const IPFSConfig: React.FC<IPFSConfigProps> = ({}) => {
  const [host, sethost] = useState<string>("static.225.91.181.135.clients.your-server.de");
  const [port, setport] = useState<string>("5002");
  const [protocol, setprotocol] = useState<string>("https");
  const [url, setUrl] = useState<string>("http://135.181.91.225:9001/ipfs/");
  const IPFSStatus = useBehaviorSubject(ipfservice.connectionStatus)
  ipfservice.connectionStatus.subscribe((x)=>{}).unsubscribe(); 
  const setHostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    sethost(e.currentTarget.value);
    ipfservice.ipfsconfig.host = e.currentTarget.value    
  };
  const setPortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setport(e.currentTarget.value);
    ipfservice.ipfsconfig.port =  parseInt(e.currentTarget.value)
   
  };
  const setProtocolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setprotocol(e.currentTarget.value);
    ipfservice.ipfsconfig.protocol  = e.currentTarget.value
   
  };
  const setUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.currentTarget.value);
    ipfservice.ipfsconfig.ipfsurl = e.currentTarget.value
    
  };

  const checkconfig = ()=>{
    toast.dismiss()
    ipfservice.setipfsHost()
  }

  return (
    <>
      <h5>Custom IPFS gateway</h5>
        <label>HOST</label>
        
      <input
        onChange={setHostChange}
        className="form-control w-100"
        type="text"
        id="reponame"
        value={host}
      />
      <label>PORT</label>
       <input
        onChange={setPortChange}
        className="form-control w-100"
        type="number"
        id="port"
        value={port}
      />
      <label>PROTOCOL</label>
       <input
        onChange={setProtocolChange}
        className="form-control w-100"
        type="text"
        id="protocol"
        value={protocol}
      />
      <label>URL</label>
       <input
        onChange={setUrlChange}
        className="form-control w-100"
        type="text"
        id="url"
        value={url}
      />
      <button className="btn btn-primary mt-5" onClick={checkconfig}>Check connection</button>
      {IPFSStatus?<div className="alert alert-success w-25 mt-2" role="alert">
        Your IPFS settings are working correctly.
      </div>:<div className="alert alert-warning w-25 mt-2" role="alert">
        Your IPFS settings are incorrect. Unable to connect. Check your settings.
      </div>}
    </>
  );
};
