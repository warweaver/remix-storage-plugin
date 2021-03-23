import React, { Suspense, useEffect } from "react";
import { useBehaviorSubject } from "../usesubscribe/index";
import {
  boxservice,
  gitservice,
  ipfservice,
  localipfsstorage,
  Utils,
} from "../../App";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";

const BoxController = React.lazy(() =>
  import("../3box/Box").then(({ BoxController }) => ({
    default: BoxController,
  }))
);

interface IPFSViewProps {}

export const IPFSView: React.FC<IPFSViewProps> = () => {
  const cid = useBehaviorSubject(ipfservice.cidBehavior);
  const boxconnected = useBehaviorSubject(boxservice.status);
  const IPFSStatus = useBehaviorSubject(ipfservice.connectionStatus);
  const canExport = useBehaviorSubject(gitservice.canExport);

  ipfservice.connectionStatus.subscribe((x) => {}).unsubscribe();
  ipfservice.cidBehavior.subscribe((x) => {}).unsubscribe();
  boxservice.status.subscribe((x) => {}).unsubscribe();
  gitservice.canExport.subscribe((x) => {}).unsubscribe();

  const getUrlLink = () => {
    if (cid !== "" && cid !== undefined && cid) {
      //Utils.log(ipfservice.cid);
      return (
        <>
          IPFS Hash: {ipfservice.cid}
          <br></br>
          <CopyToClipboard
            text={ipfservice.cid}
            onCopy={() => {
              toast.success("Copied to clipboard.");
            }}
          >
            <button className="btn btn-primary mb-2">Copy to clipboard</button>
          </CopyToClipboard>
          <br></br>
          <a className="btn btn-primary mb-2" target="_blank" href={getUrl()} id="CID">
            View files
          </a>
          <br></br>
          <a className="btn btn-primary" target="_blank" href={getVscodeUrl()} id="VSCODE">
            Clone in VSCode
          </a>
        </>
      );
    } else {
      return <></>;
    }
  };

  useEffect(() => {
    //Utils.log("export view");
    //ipfservice.setipfsHost();
  }, []);

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

  const getVscodeUrl = () =>{
    return `vscode://RemixProject.ethereum-remix/pull?cid=${cid}`;
  }

  return (
    <>
      {IPFSStatus ? (
        <></>
      ) : (
        <div className="alert alert-warning w-25 mt-2" role="alert">
          Your IPFS settings are incorrect. Unable to connect. Check your
          settings.
        </div>
      )}
      {canExport ? (
        <></>
      ) : (
        <div className="alert alert-danger w-25 mt-2" role="alert">
          Commit some files first, then you can export.
        </div>
      )}
      <h4>Export to Local storage & IPFS</h4>
      <button
        disabled={(IPFSStatus ? false : true) || (canExport ? false : true)}
        className="btn w-25 btn-primary"
        id="main-btn"
        onClick={async () => await addFilesToIpfs()}
      >
        Export to IPFS only & store in local storage
      </button>

      <br />
      <div id="ipfsAlert" role="alert"></div>
      <br />
      {getUrlLink()}
      <hr />
      <h4>Export to 3Box Storage</h4>
      <div className="alert alert-warning w-25" role="alert">
        Please make sure the IDE is on HTTPS otherwise you can't connect.
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <BoxController
          buttonTitle="Export to 3Box"
          storeData={true}
          IPFSStatus={IPFSStatus}
        />
      </Suspense>
      <div id="boxexportstatus"></div>
    </>
  );
};
