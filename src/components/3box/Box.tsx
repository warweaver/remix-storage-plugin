import React, { useState } from "react";
import Box from "3box";
import Web3Modal from "web3modal";
import { getAddress } from "@ethersproject/address";
import WalletConnectProvider from "@walletconnect/web3-provider";
import {
  boxservice,
  ipfservice,
  loaderservice,
  providerOptions,
} from "../../App";
import { toast } from "react-toastify";
import { useBehaviorSubject } from "use-subscribable";

interface BoxProps {
  buttonTitle: string;
  storeData: boolean;
  IPFSStatus: boolean | undefined;
}

export const BoxController: React.FC<BoxProps> = (p) => {
  const status = useBehaviorSubject(boxservice.status);
  let address = "";
  let mybox: Box;
  let space;

  boxservice.status.subscribe((x) => {}).unsubscribe();

  let modal: Web3Modal;
  let timer: NodeJS.Timeout;

  const callTimedOut = async () => {
    toast.error(
      "There has been an error connnecting to 3BOX. If you continue having problems consider clearing your 3BOX cookies in your browser."
    );
    boxservice.status.next(false);
    loaderservice.setLoading(false);
    try {
      clearTimeout(timer);
    } catch (e) {}
  };

  const setModalListener = async () => {
    modal.on("connect", async (provider: any) => {
      const connect = await ipfservice.setipfsHost();
      if (!connect) {
        toast.error("Unable to connect to IPFS check your settings.");
        return false;
      }
      if (!status) {
        try {
          timer = setTimeout(async () => {
            await callTimedOut();
          }, 60000);
          const [eth] = await provider.enable();
          address = getAddress(eth);
          loaderservice.setLoading(true);
          toast.info("Please wait... this can take a while");
          console.log(address);

          mybox = await Box.openBox(address, provider);
          toast.success("3box connected... waiting for space to open");
          console.log(mybox);
          space = await mybox.openSpace("remix-workspace");
          //toast.success("space opened... getting data")
          console.log(space);

          await boxservice.setSpace(space);
          await boxservice.getObjectsFrom3Box(space);
          boxservice.status.next(true);
          try {
            clearTimeout(timer);
          } catch (e) {}
        } catch (e) {
          await callTimedOut()
        }
      }
      try {
        if (p.storeData) await boxservice.storeHashIn3Box(boxservice.space);
      } catch (e) {
        toast.error("There has been an error connnecting to 3BOX.");
        boxservice.status.next(false);
      }
      loaderservice.setLoading(false);
      // .then((x) => toast.success("connected to 3box"))
      // .catch((x) => toast.error("can't connect to 3box"));
    });
  };
  const startConnect = async () => {
    modal = new Web3Modal({
      providerOptions: providerOptions, // required
    });
    await setModalListener();
    // console.log("get box", status,)
    if (!status) {
      await modal.connect();
    } else {
      loaderservice.setLoading(true);
      if (p.storeData) await boxservice.storeHashIn3Box(boxservice.space);
      loaderservice.setLoading(false);
    }
  };

  return (
    <>
      <button
        disabled={p.IPFSStatus ? false : true}
        className="btn w-25 btn-primary 3boxbtn"
        id="boxconnect"
        onClick={async () => await startConnect()}
      >
        {p.buttonTitle}
      </button>
      <div id="3boxconnection">
        {status ? <>connected</> : <>disconnected</>}
      </div>
    </>
  );
};
