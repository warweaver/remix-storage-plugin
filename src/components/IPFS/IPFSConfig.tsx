import React, { useState } from "react";
import { ipfservice } from "../../App";

interface IPFSConfigProps {}

export const IPFSConfig: React.FC<IPFSConfigProps> = ({}) => {
  const [host, sethost] = useState<string>("localhost");
  const [port, setport] = useState<string>("5001");
  const [protocol, setprotocol] = useState<string>("http");
  const [url, setUrl] = useState<string>("https://ipfs.io/ipfs/");

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
    ipfservice.setipfsHost()
  }

  return (
    <>
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
        id="reponame"
        value={port}
      />
      <label>PROTOCOL</label>
       <input
        onChange={setProtocolChange}
        className="form-control w-100"
        type="text"
        id="reponame"
        value={protocol}
      />
      <label>URL</label>
       <input
        onChange={setUrlChange}
        className="form-control w-100"
        type="text"
        id="reponame"
        value={url}
      />
      <button className="btn btn-primary mt-5" onClick={checkconfig}>Check connection</button>
    </>
  );
};
