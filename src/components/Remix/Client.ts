import { PluginClient } from "@remixproject/plugin";
import { createClient } from "@remixproject/plugin-webview";
import { toast } from "react-toastify";
import { BehaviorSubject } from "rxjs";
import { fileservice } from "../../App";

export class WorkSpacePlugin extends PluginClient {
  clientLoaded = new BehaviorSubject(false);
  callBackEnabled: boolean = true;

  constructor() {
    super();
    createClient(this);
    toast.info("Connecting to REMIX");
    this.onload().then(async () => {
      console.log("workspace client loaded", this);
      toast.success("Connected to REMIX");
      this.clientLoaded.next(true);
      await this.setCallBacks();
    });
  }

  async setCallBacks() {
    this.on(
      "solidity",
      "compilationFinished",
      async (file, source, version, result) => {
        console.log("compilationFinished");
        console.log(result.contracts);
        const r = await this.call("solidity", "getCompilationResult");
        console.log("getCompilationResult");
        console.log(r.contracts);
      }
    );

    this.on("fileManager", "fileSaved", async (e) => {
      // Do something
      if (this.callBackEnabled) {
        console.log(e);
        await fileservice.addFileFromBrowser(e);
        await fileservice.showFiles();
      }
      //await this.addFileFromBrowser(e)
    });

    this.on("fileManager", "fileAdded", async (e) => {
      // Do something
      if (this.callBackEnabled) {
        await fileservice.addFileFromBrowser(e);
        await fileservice.showFiles();
        console.log(e);
      }
    });

    this.on("fileManager", "fileRemoved", async (e) => {
      // Do something
      console.log(e);
      if (this.callBackEnabled) {
        await fileservice.rmFile(e);
        //await gitservice.gitrm(e)
        await fileservice.showFiles();
      }
      // await this.rmFile(e)
    });

    this.on("fileManager", "currentFileChanged", async (e) => {
      // Do something
      if (this.callBackEnabled) {
        console.log(e, this);
      }
      //await this.rmFile(e)
    });

    this.on("fileManager", "fileRenamed", async (oldfile, newfile) => {
      // Do something
      if (this.callBackEnabled) {
        console.log(oldfile, newfile);
        await fileservice.rmFile(oldfile);
        await fileservice.addFileFromBrowser(newfile);
        await fileservice.showFiles();
      }
      //await this.addFileFromBrowser(e)
    });
    this.callBackEnabled = true;
  }

  async disableCallBacks() {
    this.callBackEnabled = false;
  }
  async enableCallBacks() {
    this.callBackEnabled = true;
  }
}
