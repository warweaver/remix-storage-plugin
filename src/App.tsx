import React, { createRef, useEffect, useRef, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Container, Tabs, Tab, Button } from "react-bootstrap";
import Box from "3box";
import Web3Modal from "web3modal";
import { getAddress } from "@ethersproject/address";
import WalletConnectProvider from "@walletconnect/web3-provider";
import FS from "@isomorphic-git/lightning-fs";
import { FileExplorer } from "./components/Files/FileExplorer";
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
import { IPFSConfig } from "./components/IPFS/IPFSConfig";
import { GitStatus } from "./components/git/UI/gitStatus";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FileHelp } from "./components/Files/FileHelp";
import { GitHelp } from "./components/git/UI/GitHelp";
import { ExportHelp } from "./components/IPFS/ExportHelp";
import { ImportHelp } from "./components/Import/ImportHelp";
import { ConfigHelp } from "./components/IPFS/ConfigHelp";

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

export const resetFileSystem = async (wipe: boolean = false) => {
  try {
    fsConfig = new FS("remix-storage-config");
    fsConfigPromise = fsConfig.promises;
    fsNoPromise = new FS("remix-workspace", { wipe: wipe });
    fs = fsNoPromise.promises;
    localipfsstorage.init();
    client.clientLoaded.subscribe(async (load: boolean) => {
      if (load) await fileservice.syncStart();
    });
    return true;
    //await fileservice.showFiles();
  } catch (e) {
    console.log("FS WARNING");
    return false;
  }
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
  const [canLoad, setCanLoad] = useState<boolean>(false);
  const repoName = useBehaviorSubject(gitservice.reponameSubject);
  const canCommit = useBehaviorSubject(gitservice.canCommit);
  const [confirmShow, setConfirmShow] = React.useState(false);

  gitservice.reponameSubject.subscribe((x) => {}).unsubscribe();
  gitservice.canCommit.subscribe((x) => {}).unsubscribe();
  loaderservice.loading.subscribe((x) => {}).unsubscribe();

  const setTab = async (key: string) => {
    setActiveKey(key);
    if (key == "diff") {
      //loaderservice.setLoading(true);
      await gitservice.diffFiles();
      //loaderservice.setLoading(false);
    }
  };

  useEffect(() => {
    var request = window.indexedDB.open("MyTestDatabase", 3);
    console.log(request);
    request.onerror = function (event) {
      console.log("DB not supported");
      setCanLoad(false);
      return false;
    };
    request.onsuccess = function (event) {
      console.log("DB supported");
      resetFileSystem(false).then((x) => setCanLoad(x));
    };

    //setCanLoad(r)
  }, []);

  return (
    <div className="App">
      {!canLoad ? (
        <ConnectionWarning canLoad={canLoad} />
      ) : (
        <Container fluid>
          {loading ? (
            <Loading loading background="#2ecc71" loaderColor="#3498db" />
          ) : (
            <></>
          )}
          <RepoName />
          <FontAwesomeIcon icon={faExclamationTriangle}></FontAwesomeIcon><a className='small pl-2' href='https://github.com/bunsenstraat/remix-storage-plugin/issues' target='_blank'>Submit issues</a>
          <div className="nav navbar bg-light p-3"><div><div className="float-left pr-1 m-0 text-white">dGit</div> | repo: {repoName}</div></div>
          
          <GitStatus></GitStatus>
          <br></br>
          {canCommit ? (
            <></>
          ) : (
            <div className="alert alert-warning w-25">
              You are in a detached state.<br></br>
            </div>
          )}
          <ToastContainer position="top-right" />
          
          
          <Tabs
            activeKey={activeKey}
            onSelect={async (k) => await setTab(k || "files")}
          >
            <Tab className="mt-4 ml-1" eventKey="files" title="FILES">
              <FileExplorer setTab={setTab} />
              <FileTools />
              <FileHelp/>
            </Tab>
            <Tab className="mt-4 ml-1" eventKey="git" title="GIT">
              <GitControls />
              <GitHelp/>
            </Tab>
            <Tab className="mt-4 ml-1" eventKey="export" title="EXPORT">
              <IPFSView />
              <ExportHelp/>
            </Tab>
            <Tab className="mt-4 ml-1" eventKey="import" title="IMPORT">
              <Importer />
              <ImportHelp></ImportHelp>
            </Tab>
            <Tab className="mt-4 ml-1" eventKey="diff" title="DIFF">
              <DiffView />
            </Tab>
            <Tab className="mt-4 ml-1" eventKey="config" title="SETTINGS">
              <IPFSConfig />
              <ConfigHelp/>
            </Tab>
            <Tab className="mt-4 ml-1" eventKey="help" title="HELP">
              <Help />
            </Tab>
          </Tabs>
        </Container>
      )}
    </div>
  );
}

export default App;
