import React from "react";
import { useBehaviorSubject } from "use-subscribable";
import { boxservice, ipfservice } from "../../App";

interface IPFSViewProps {}

export const IPFSView: React.FC<IPFSViewProps> = () => {
  const cid = useBehaviorSubject(ipfservice.cidBehavior);
  const boxconnected = useBehaviorSubject(boxservice.status);

  ipfservice.cidBehavior.subscribe((x) => {}).unsubscribe();
  boxservice.status.subscribe((x) => {}).unsubscribe();

  const getUrlLink = () => {
    if (ipfservice.cid !== "") {
      return (
        <a target="_blank" href={getUrl()} id="CID">
          Your data is here: {getUrl()}
        </a>
      );
    } else {
      return <></>;
    }
  };

  const getUrl = () => {
    return `${ipfservice.ipfsconfig.ipfsurl}${cid}`;
  };

  return (
    <>
      <button
        className="btn w-25 btn-primary"
        id="main-btn"
        onClick={async () => ipfservice.addToIpfs()}
      >
        upload to IPFS only
      </button>
      <br />
      <div id="ipfsAlert" role="alert"></div>
      <br />
      {getUrlLink()}
      <hr />
      <div className="alert alert-info" role="alert">
        This will export the files to IPFS and store a key in your 3Box account.
      </div>

      <button
        className="btn w-25 btn-primary 3boxbtn"
        disabled={!boxconnected || ipfservice.cid === ""}
        onClick={async () => await boxservice.storeHashIn3Box(boxservice.space)}
      >
        Export to 3Box & IPFS
      </button>
      <div id="boxexportstatus"></div>
    </>
  );
};
