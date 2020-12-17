import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Suspense } from "react";
import { Card } from "react-bootstrap";
import { useBehaviorSubject } from "use-subscribable";
import { boxservice, ipfservice } from "../../App";
import { boxObject } from "../3box/3boxService";
//import { BoxController } from "../3box/Box";

interface boximporterProps {}

export const BoxImporter: React.FC<boximporterProps> = ({}) => {
  const boxobjects = useBehaviorSubject(boxservice.boxObjects);
  const BoxController = React.lazy(() =>
    import("../3box/Box").then(({ BoxController }) => ({
      default: BoxController,
    }))
  );

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
      <Suspense fallback={<div>Loading...</div>}>
        <BoxController buttonTitle="Connect to 3Box" storeData={false} />
      </Suspense>
      <div className="container-fluid">
        {(boxobjects || []).map((o) => {
          return (
            <div className="row p-1 small">
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
                  onClick={async () => await ipfservice.importFromCID(o.cid)}
                  className="btn btn-primary btn-sm mr-2 import3b-btn"
                >
                  import
                </button>
                <button
                  onClick={async () => await boxservice.deleteFrom3Box(o.key)}
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
