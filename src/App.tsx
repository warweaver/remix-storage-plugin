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
import { FileTools } from "./components/Files/FileTools";
import { DiffView } from "./components/git/Diff";
import { IPFSService } from "./components/IPFS/IPFSService";
import { BoxService } from "./components/3box/3boxService";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const fsNoPromise: any = new FS("remix-workspace");
export const fs: any = fsNoPromise.promises;
export const gitservice: gitService = new gitService();
export const client: WorkSpacePlugin = new WorkSpacePlugin();
export const fileservice: LsFileService = new LsFileService();
export const ipfservice:IPFSService = new IPFSService();
export const boxservice:BoxService = new BoxService();


function App() {
  const [activeKey, setActiveKey] = useState<string>("files")


  const setTab = (key:string)=>{
    setActiveKey(key)
  }


  return (
    <div className="App">
      <Container fluid>
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
