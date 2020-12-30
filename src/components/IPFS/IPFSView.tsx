import React, { Suspense, useEffect } from "react";
import { useBehaviorSubject } from "use-subscribable";
import { boxservice, ipfservice, localipfsstorage } from "../../App";

interface IPFSViewProps {}

export const IPFSView: React.FC<IPFSViewProps> = () => {
  const cid = useBehaviorSubject(ipfservice.cidBehavior);
  const boxconnected = useBehaviorSubject(boxservice.status);
  const IPFSStatus = useBehaviorSubject(ipfservice.connectionStatus)
  const BoxController = React.lazy(() =>
    import("../3box/Box").then(({ BoxController }) => ({
      default: BoxController
    }))
  );
  ipfservice.connectionStatus.subscribe((x)=>{}).unsubscribe(); 
  ipfservice.cidBehavior.subscribe((x) => {}).unsubscribe();
  boxservice.status.subscribe((x) => {}).unsubscribe();

  const getUrlLink = () => {
    if (cid !== "" && cid !== undefined && cid) {
      console.log(ipfservice.cid)
      return (
        <a target="_blank" href={getUrl()} id="CID">
          Your data is here: {getUrl()}
        </a>
      );
    } else {
      return <></>;
    }
  };

  useEffect(()=>{
    ipfservice.setipfsHost()
  },[])

  const addFilesToIpfs = async () => {
    try {
      await ipfservice.addToIpfs();
      await localipfsstorage.addToStorage(
        await localipfsstorage.createBoxObject()
      );
    } catch (e) {}
  };

  const getUrl = () => {
    return `${ipfservice.ipfsconfig.ipfsurl}${cid}`;
  };

  return (
    <>
      <h4>Export to Local storage & IPFS</h4>
      <button
        disabled={IPFSStatus?false:true}
        className="btn w-25 btn-primary"
        id="main-btn"
        onClick={async () => await addFilesToIpfs()}
      >
        Export to IPFS only & store in local storage
      </button>
      {IPFSStatus?<></>:<div className="alert alert-warning w-25 mt-2" role="alert">
        Your IPFS settings are incorrect. Unable to connect. Check your settings.
      </div>}
      <br />
      <div id="ipfsAlert" role="alert"></div>
      <br />
      {getUrlLink()}
      <hr />
      <h4>Export to 3Box Storage</h4>
      <div className="alert alert-info w-25" role="alert">
        This will export the files to IPFS and store a key in your 3Box account.
      </div>
      <div className="alert alert-warning w-25" role="alert">
        Please make sure the IDE is on HTTPS otherwise you can't connect.
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <BoxController buttonTitle="Export to 3Box" storeData={true} IPFSStatus={IPFSStatus} />
      </Suspense>
      <div id="boxexportstatus"></div>
    </>
  );
};
