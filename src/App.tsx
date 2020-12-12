import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Container, Tabs, Tab } from "react-bootstrap";
import Box from "3box";
import Web3Modal from "web3modal";
import { getAddress } from "@ethersproject/address";
import WalletConnectProvider from "@walletconnect/web3-provider";
import FS from "@isomorphic-git/lightning-fs";
import { FileExplorer } from "./components/Files/FileExplorer";
import { BoxController } from "./components/3box/Box";
import { GitControls } from "./components/git/gitControls";

import { IPFSView } from "./components/IPFS/IPFSView";
import { WorkSpacePlugin } from "./components/Remix/Client";
import { gitService } from "./components/git/gitService";

import { LsFileService } from "./components/Files/FileService";
import { WalletView } from "./components/Wallet/WalletView";
import { FileTools } from "./components/Files/FileTools";
import { DiffView } from "./components/git/Diff";
import { WalletService } from "./components/Wallet/WalletService";
import { IPFSService } from "./components/IPFS/IPFSService";
import { BoxService } from "./components/3box/3boxService";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const fsNoPromise: any = new FS("remix-workspace");
export const fs: any = fsNoPromise.promises;
export const gitservice: gitService = new gitService();
export const client: WorkSpacePlugin = new WorkSpacePlugin();
export const fileservice: LsFileService = new LsFileService();
export const walletservice:WalletService = new WalletService();
export const ipfservice:IPFSService = new IPFSService();
export const boxservice:BoxService = new BoxService();


function App() {
  const [activeKey, setActiveKey] = useState<string>("files")


  const setTab = (key:string)=>{
    setActiveKey(key)
  }
  let address = "";

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
    console.log(address)
    Box.create(window.ethereum).then((x)=>{console.log(x)})
    Box.openBox(address, window.ethereum).then((x)=>console.log(x))
  });

  const startConnect = ()=>{
    modal.connect();
  }

  return (
    <div className="App">
      <Container fluid>
      <button value='here' onClick={()=>startConnect()}>here</button>
        <h1>Storage</h1>
        <ToastContainer position="bottom-right" />
        <Tabs activeKey={activeKey} onSelect={(k) => setTab(k || "files")}>
          <Tab className="mt-4 ml-1" eventKey="files" title="Files">
            <FileExplorer setTab={setTab}/>
            <FileTools/>
          </Tab>
          <Tab className="mt-4 ml-1" eventKey="git" title="Git">
            <GitControls />
          </Tab>
          <Tab className="mt-4 ml-1" eventKey="connections" title="Connections">
            <BoxController/>
          </Tab>
          <Tab className="mt-4 ml-1" eventKey="export" title="Export">
            <IPFSView />
          </Tab>
          <Tab className="mt-4 ml-1" eventKey="diff" title="Diff">
            <DiffView/>
          </Tab>
        </Tabs>
      </Container>
    </div>
  );

}

export default App;
