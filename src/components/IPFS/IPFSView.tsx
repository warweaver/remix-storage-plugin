import React from "react";
import { useBehaviorSubject } from "use-subscribable";
import { boxservice, ipfservice, localipfsstorage } from "../../App";
import { BoxController } from "../3box/Box";

interface IPFSViewProps {}

export const IPFSView: React.FC<IPFSViewProps> = () => {
  const cid = useBehaviorSubject(ipfservice.cidBehavior);
  const boxconnected = useBehaviorSubject(boxservice.status);

  ipfservice.cidBehavior.subscribe((x) => {}).unsubscribe();
  boxservice.status.subscribe((x) => {}).unsubscribe();

  const getUrlLink = () => {
    if (ipfservice.cid !== "" && ipfservice.cid !== undefined) {
      return (
        <a target="_blank" href={getUrl()} id="CID">
          Your data is here: {getUrl()}
        </a>
      );
    } else {
      return <></>;
    }
  };

  const addFilesToIpfs = async ()=>{
    try{
      await ipfservice.addToIpfs()
      await localipfsstorage.addToStorage(await localipfsstorage.createBoxObject())
    }catch(e){

    }
  }

  const getUrl = () => {
    return `${ipfservice.ipfsconfig.ipfsurl}${cid}`;
  };

  return (
    <>
    <h4>Local storage & IPFS</h4>
      <button
        className="btn w-25 btn-primary"
        id="main-btn"
        onClick={async () => await addFilesToIpfs() }
      >
        Export to IPFS only & store in local storage
      </button>
      <br />
      <div id="ipfsAlert" role="alert"></div>
      <br />
      {getUrlLink()}
      <hr />
      <h4>3Box Storage</h4>
      <div className="alert alert-info w-25" role="alert">
        This will export the files to IPFS and store a key in your 3Box account.
      </div>
      <BoxController buttonTitle="Export to 3Box" storeData={true}/>
      {/* <h4>Step 2</h4>
      <button
        className="btn w-25 btn-primary 3boxbtn"
        disabled={!boxconnected}
        onClick={async () => await boxservice.storeHashIn3Box(boxservice.space)}
      >
        Export to 3Box & IPFS
      </button> */}
      <div id="boxexportstatus"></div>
    </>
  );
};
