import React, { useEffect, useState } from "react";
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
import { GitControls } from "./components/git/UI/gitControls";

import { IPFSView } from "./components/IPFS/IPFSView";
import { WorkSpacePlugin } from "./components/Remix/Client";
import { gitService } from "./components/git/gitService";

import { LsFileService } from "./components/Files/FileService";
import { FileTools } from "./components/Files/FileTools";
import { DiffView } from "./components/git/diff/Diff";
import { IPFSService } from "./components/IPFS/IPFSService";
import { BoxService } from "./components/3box/3boxService";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Importer } from "./components/Import/importer";
import Loading from "react-fullscreen-loading";
import { LoaderService } from "./components/loaderService";
import { useBehaviorSubject } from "use-subscribable";
import { Help } from "./components/Help";
import { RepoName } from "./components/git/UI/RepoName";
import { LocalIPFSStorage } from "./components/LocalStorage/LocalStorage";
import { ConnectionWarning } from "./components/ConnectionWarning";

export var fsConfig: any; //= new FS("remix-storage-config");
export var fsConfigPromise: any; // = fsConfig.promises;

export var fsNoPromise: any; // = new FS("remix-workspace");
export var fs: any; // = fsNoPromise.promises;
export const gitservice: gitService = new gitService();
export const client: WorkSpacePlugin = new WorkSpacePlugin();
export const fileservice: LsFileService = new LsFileService();
export const ipfservice: IPFSService = new IPFSService();
export const boxservice: BoxService = new BoxService();
export const loaderservice: LoaderService = new LoaderService();
export const localipfsstorage: LocalIPFSStorage = new LocalIPFSStorage();

export const resetFileSystem = async () => {
  try {
    fsConfig = new FS("remix-storage-config");
    fsConfigPromise = fsConfig.promises;
    fsNoPromise = new FS("remix-workspace", { wipe: true });
    fs = fsNoPromise.promises;
    localipfsstorage.init()
    client.clientLoaded.subscribe(async (load:boolean)=>{
      if(load)await fileservice.syncStart()
    })
    //await fileservice.showFiles();
  } catch (e) {}
};

export const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: "83d4d660ce3546299cbe048ed95b6fad",
    },
  },
};

function App() {
  const [activeKey, setActiveKey] = useState<string>("files");
  const loading: boolean | undefined = useBehaviorSubject(
    loaderservice.loading
  );
  const repoName = useBehaviorSubject(gitservice.reponameSubject);
  gitservice.reponameSubject.subscribe((x) => {}).unsubscribe();
  loaderservice.loading.subscribe((x) => {}).unsubscribe();

  const setTab = async (key: string) => {
    setActiveKey(key);
    if (key == "diff") {
      loaderservice.setLoading(true);
      await gitservice.diffFiles();
      loaderservice.setLoading(false);
    }
  };

  return (
    <div className="App">
      <Container fluid>
        {loading ? (
          <Loading loading background="#2ecc71" loaderColor="#3498db" />
        ) : (
          <></>
        )}
        <RepoName />
        <ConnectionWarning />
        <h1>Storage: {repoName}</h1>
        <ToastContainer position="bottom-right" />
        <Tabs
          activeKey={activeKey}
          onSelect={async (k) => await setTab(k || "files")}
        >
          <Tab className="mt-4 ml-1" eventKey="files" title="Files">
            <FileExplorer setTab={setTab} />
            <FileTools />
          </Tab>
          <Tab className="mt-4 ml-1" eventKey="git" title="Git">
            <GitControls />
          </Tab>
          <Tab className="mt-4 ml-1" eventKey="export" title="Export">
            <IPFSView />
          </Tab>
          <Tab className="mt-4 ml-1" eventKey="import" title="Import">
            <Importer />
          </Tab>
          <Tab className="mt-4 ml-1" eventKey="diff" title="Diff">
            <DiffView />
          </Tab>
          <Tab className="mt-4 ml-1" eventKey="help" title="Help">
            <Help />
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
}

export default App;
