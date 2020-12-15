import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card } from "react-bootstrap";
import { useBehaviorSubject } from "use-subscribable";
import { boxservice, ipfservice } from "../../App";
import { boxObject } from "../3box/3boxService";
import { BoxController } from "../3box/Box";

interface boximporterProps {}

export const BoxImporter: React.FC<boximporterProps> = ({}) => {
  const boxobjects = useBehaviorSubject(boxservice.boxObjects);

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

  const getUrl = (cid: string) => {
    return `${ipfservice.ipfsconfig.ipfsurl}${cid}`;
  };

  return (
    <>
      <hr></hr>
      <h4>3Box storage</h4>
      <div className="alert alert-info" role="alert">
        This will import the IPFS repo from a key stored in your 3Box account.
      </div>
      <BoxController buttonTitle="Connect to 3Box" storeData={false}/>
      <div className="container-fluid">
        {(boxobjects || []).map((o) => {
          return (
            <div className="row p-1 small">
              <Card className="w-75">
                <Card.Body>
                    <Card.Title>
                  {o.key}
                  </Card.Title>
                  <br />
                  IPFS: {getUrlLink(o.cid)}
                  <br />
                  DATE: {o.datestored}
                  <br />
                  DATE OF LAST COMMIT: {o.datecommit}
                  <br />
                  MESSAGE: {o.message}
                  <br />
                  COMMIT: {o.ref}
                  <br />
                </Card.Body>
              </Card>
              <div className="col">
                <button onClick={async()=> await ipfservice.importFromCID(o.cid)} className="btn btn-primary btn-sm mr-2 import3b-btn">
                  import
                </button>
                <button onClick={async()=> await boxservice.deleteFrom3Box(o.key)} className="btn btn-danger btn-sm delete3b-btn">
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
