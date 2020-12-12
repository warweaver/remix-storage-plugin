import React, { useState } from "react";
import Box from "3box";
import Web3Modal from "web3modal";
import { getAddress } from "@ethersproject/address";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { boxservice } from "../../App";
import { toast } from "react-toastify";

interface BoxProps {}

export const BoxController: React.FC<BoxProps> = () => {
  const [status,setStatus] = useState(false)
  let address = "";
  let mybox
  let space

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: "83d4d660ce3546299cbe048ed95b6fad",
      },
    },
  };

  const modal = new Web3Modal({
    providerOptions: providerOptions, // required
  });

  modal.on("connect", async (provider) => {
    const [eth] = await provider.enable();
    address = getAddress(eth);
    toast.info("Please wait...")
    console.log(address);
    mybox = await Box.openBox(address, window.ethereum)
    toast.success("3box connected... waiting for space to open")
    console.log(mybox)
    space = await mybox.openSpace("remix-workspace");
    toast.success("space opened... getting data")
    console.log(space);
   
    await boxservice.setSpace(space)
    await boxservice.getHashesFrom3Box(space)
    boxservice.status.next(true)

    setStatus(true)
      // .then((x) => toast.success("connected to 3box"))
      // .catch((x) => toast.error("can't connect to 3box"));
  });

  const startConnect = async () => {
    modal.connect();
  };

  return (
    <>
      <hr />
      <button
        className="btn w-25 btn-primary 3boxbtn"
        id="boxconnect"
        onClick={async () => await startConnect()}
      >
        Connect to wallet & 3box
      </button>
      <div id="3boxconnection">{status?<>connected</>:<>disconnected</>}</div>
    </>
  );
};
