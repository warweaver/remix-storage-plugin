import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { createRef, Suspense } from "react";
import { Card } from "react-bootstrap";
import { useBehaviorSubject } from "use-subscribable";
import { boxservice, ipfservice } from "../../App";
import { boxObject } from "../3box/3boxService";
import ConfirmDelete from "../ConfirmDelete";
//import { BoxController } from "../3box/Box";

interface boximporterProps {}

export const BoxImporter: React.FC<boximporterProps> = ({}) => {
  const boxobjects = useBehaviorSubject(boxservice.boxObjects);
  const IPFSStatus = useBehaviorSubject(ipfservice.connectionStatus);
  const BoxController = React.lazy(() =>
    import("../3box/Box").then(({ BoxController }) => ({
      default: BoxController,
    }))
  );
  let ModalRef = createRef<ConfirmDelete>();
  let EraseModalRef = createRef<ConfirmDelete>();
  ipfservice.connectionStatus.subscribe((x) => {}).unsubscribe();
  boxservice.boxObjects
    .subscribe((x) => {
      console.log("box objects", x);
    })
    .unsubscribe();

  const getUrlLink = (cid: string | undefined) => {
    if (cid !== "" && cid !== undefined) {
      return (
        <a target="_blank" href={getUrl(cid)} id="CID">
          {getUrl(cid)}
        </a>
      );
    } else {
      return <></>;
    }
  };

  const getViewButton = (cid: string | undefined) => {
    if (cid !== "" && cid !== undefined) {
      return (
        <a
          className="btn btn-primary btn-sm mr-2"
          target="_blank"
          href={getUrl(cid)}
          id="CID"
        >
          View files
        </a>
      );
    } else {
      return <></>;
    }
  };

  const getUrl = (cid: string) => {
    return `${ipfservice.ipfsconfig.ipfsurl}${cid}`;
  };

  const importFromCID = async (cid: string | undefined, name: string = "") => {
    try {
      await ModalRef.current?.show();
      await ipfservice.importFromCID(cid, name);
      console.log("yes");
    } catch (e) {
      console.log("no");
    }
  };

  const deleteFrom3Box = async(o:any) =>{
    try {
      await EraseModalRef.current?.show();
      await boxservice.deleteFrom3Box(o.key)
      console.log("yes");
    } catch (e) {
      console.log("no");
    }
  }

  return (
    <>
      <hr></hr>
      <h4>3Box storage</h4>
      <ConfirmDelete title={"Importing"} text={"Importing will delete the files you are working on! Continue?"} ref={ModalRef}></ConfirmDelete>
      <ConfirmDelete title={"Deleting"} text={"Are you sure you want to erase this item?"} ref={EraseModalRef}></ConfirmDelete>
      <div className="alert alert-info" role="alert">
        This will import the IPFS repo from a key stored in your 3Box account.
      </div>
      <div className="alert alert-warning" role="alert">
        Please make sure the IDE is on HTTPS otherwise you can't connect.
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <BoxController
          buttonTitle="Connect to 3Box"
          storeData={false}
          IPFSStatus={IPFSStatus}
        />
      </Suspense>
      <div className="container-fluid">
        {(boxobjects || []).map((o) => {
          return (
            <div key={o.key} className="row p-1 small">
              <Card className="w-75">
                <Card.Body>
                  <Card.Title>{o.key}</Card.Title>
                  <div className="row">
                    <div className="col">IPFS</div>
                    <div className="col">{getUrlLink(o.cid)}</div>
                  </div>
                  <div className="row">
                    <div className="col">DATE EXPORTED</div>
                    <div className="col">{o.datestored}</div>
                  </div>
                  <div className="row">
                    <div className="col">DATE OF LAST COMMIT</div>
                    <div className="col">{o.datecommit}</div>
                  </div>
                  <div className="row">
                    <div className="col">MESSAGE</div>
                    <div className="col">{o.message}</div>
                  </div>
                </Card.Body>
              </Card>
              <div className="col">
                <button
                  onClick={async () => await importFromCID(o.cid, o.key)}
                  className="btn btn-primary btn-sm mr-2 import3b-btn"
                >
                  import
                </button>
                {getViewButton(o.cid)}
                <button
                  onClick={async () => await deleteFrom3Box(o)}
                  className="btn btn-danger btn-sm delete3b-btn"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
