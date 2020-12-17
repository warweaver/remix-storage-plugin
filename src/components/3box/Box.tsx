import React, { useState } from "react";
import Box from "3box";
import Web3Modal from "web3modal";
import { getAddress } from "@ethersproject/address";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { boxservice, loaderservice, providerOptions } from "../../App";
import { toast } from "react-toastify";
import { useBehaviorSubject } from "use-subscribable";

interface BoxProps {
  buttonTitle: string;
  storeData: boolean;
}

export const BoxController: React.FC<BoxProps> = (p) => {
  const status = useBehaviorSubject(boxservice.status);
  let address = "";
  let mybox: Box;
  let space;

  boxservice.status.subscribe((x) => {}).unsubscribe();

  let modal: Web3Modal;

  const setModalListener = async () => {
    modal.on("connect", async (provider:any) => {
      if (!status) {
        const [eth] = await provider.enable();
        address = getAddress(eth);
        loaderservice.setLoading(true);
        toast.info("Please wait... this can take a while");
        console.log(address);
        mybox = await Box.openBox(address, window.ethereum);
        toast.success("3box connected... waiting for space to open");
        console.log(mybox);
        space = await mybox.openSpace("remix-workspace");
        //toast.success("space opened... getting data")
        console.log(space);

        await boxservice.setSpace(space);
        await boxservice.getObjectsFrom3Box(space);
        boxservice.status.next(true);
      }
      if (p.storeData) await boxservice.storeHashIn3Box(boxservice.space);
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
