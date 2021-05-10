import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { createRef, useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useBehaviorSubject } from "../usesubscribe/index";
import { client, ipfservice, localipfsstorage, Utils } from "../../App";
import ConfirmDelete from "../ConfirmDelete";
import { init } from "isomorphic-git";
import dateFormat from "dateformat";

interface PinataImportProps {}

export const PinataImport: React.FC<PinataImportProps> = ({}) => {
  const status = useBehaviorSubject(ipfservice.pinataConnectionStatus);
  let [data, setData] = useState<any[]>([]);
  let ModalRef = createRef<ConfirmDelete>();
  let EraseModalRef = createRef<ConfirmDelete>();

  ipfservice.pinataConnectionStatus.subscribe((x) => {}).unsubscribe();

  useEffect(() => {
    console.log("update pinata", status);
    if (status) read();
  }, [status]);

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

  const read = async () => {
    try {
      try {
        let r = await client.call(
          "dGitProvider" as any,
          "pinList",
          ipfservice.pinataConfig.key,
          ipfservice.pinataConfig.secret
        );

        console.log(r);
        setData(r.rows);
      } catch (err) {
        console.log(err);
      }
      //this.objects = r? JSON.parse(r):[];
      //Utils.log("READ CONFIG",this.objects);
    } catch (e) {}
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
      //Utils.log("yes");
    } catch (e) {
      //Utils.log("no");
    }
  };

  const deleteItem = async (cid: string) => {
    try {
      await EraseModalRef.current?.show();
      try {
        let r = await client.call(
          "dGitProvider" as any,
          "unPin",
          ipfservice.pinataConfig.key,
          ipfservice.pinataConfig.secret,
          cid
        );
        console.log(r);
        await read()
      } catch (err) {
        console.log(err);
      }
      //await localipfsstorage.deleteFromStorage(o?.ipfs_pin_hash);
      //Utils.log("yes");
    } catch (e) {
      //Utils.log("no");
    }
  };

  return (
    <>
      <h4>Import from Pinata</h4>
      <ConfirmDelete
        title={"Importing"}
        text={"This will create a new workspace! Continue?"}
        ref={ModalRef}
      ></ConfirmDelete>
      <ConfirmDelete
        title={"Deleting"}
        text={"Are you sure you want to erase this item?"}
        ref={EraseModalRef}
      ></ConfirmDelete>
      <div className="container-fluid">
        {(data || []).map((o: any, index: any) => {
          return (
            <div key={index} className="row p-1">
              <Card className="w-75">
                <Card.Body>
                  <h5>{o.metadata.name}</h5>
                  <div className="row">
                    <div className="col">IPFS</div>
                    <div className="col">{o.ipfs_pin_hash}</div>
                  </div>
                  <div className="row">
                    <div className="col">DATE EXPORTED</div>
                    <div className="col">{dateFormat(o.date_pinned,"dddd, mmmm dS, yyyy, h:MM:ss TT")}</div>
                  </div>
                  <div className="row">
                    <div className="col">MESSAGE</div>
                    <div className="col">{o.metadata.keyvalues.message}</div>
                  </div>
                </Card.Body>
              </Card>
              <div className="col">
                <button
                  onClick={async () =>
                    await importFromCID(o.ipfs_pin_hash, o.metadata.name)
                  }
                  className="btn btn-primary btn-sm mr-2 import3b-btn"
                >
                  import
                </button>
                {getViewButton(o.ipfs_pin_hash)}
                <button
                  onClick={async () => await deleteItem(o.ipfs_pin_hash)}
                  className="btn btn-danger btn-sm delete3b-btn"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          );
        })}
        {data?.length === 0 ? <>Nothing has been stored here yet.</> : <></>}
      </div>
      <hr></hr>
    </>
  );
};
