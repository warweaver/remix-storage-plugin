import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { Card } from "react-bootstrap";
import { useBehaviorSubject } from "use-subscribable";
import { ipfservice, localipfsstorage } from "../../App";

interface LocalIPFSViewProps {}

export const LocalIPFSView: React.FC<LocalIPFSViewProps> = ({}) => {
  const boxobjects = useBehaviorSubject(localipfsstorage.boxObjects);

  useEffect(() => {
    //localipfsstorage.init();
  }, []);

  localipfsstorage.boxObjects
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
      <h4>Local Storage</h4>
      <div className="container-fluid">
        {(boxobjects || []).map((o, index) => {
          return (
            <div key={index} className="row p-1 small">
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
                  onClick={async () => await ipfservice.importFromCID(o.cid, o.key)}
                  className="btn btn-primary btn-sm mr-2 import3b-btn"
                >
                  import
                </button>
                <button
                  onClick={async () =>
                    await localipfsstorage.deleteFromStorage(o?.cid)
                  }
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
