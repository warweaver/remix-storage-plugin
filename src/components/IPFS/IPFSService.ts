import IpfsHttpClient from "ipfs-http-client";
import { toast } from "react-toastify";
import { BehaviorSubject } from "rxjs";
import { resetFileSystem, fileservice, gitservice, ipfservice, loaderservice, client, Utils } from "../../App";

export interface ipfsConfig {
  host: string;
  port: number;
  protocol: string;
  ipfsurl?: string;
}

export interface ipfsFileObject {
  path: string;
  content: string;
}

export class IPFSService {
  ipfsconfig: ipfsConfig = {
    host: "ipfs.komputing.org",
    port: 443,
    protocol: "https",
    ipfsurl: "https://ipfsgw.komputing.org/ipfs/",
  };


  ipfs = IpfsHttpClient(this.ipfsconfig);
  filesToSend: ipfsFileObject[] = [];
  cid: string = "";
  cidBehavior = new BehaviorSubject<string>("");
  connectionStatus = new BehaviorSubject<boolean>(false)

  async getipfsurl() {
    return this.ipfsconfig.ipfsurl;
    //return $("#IPFS-url").val() != "" ? $("#IPFS-url").val() : false || ipfsurl;
  }

  async setipfsHost() {
    console.log(this.ipfsconfig)
    try {
      const c = await client.call("dGitProvider", "setIpfsConfig", this.ipfsconfig ) 
      console.log(c)
      this.connectionStatus.next(c)
      return true;
    } catch (e) {
      console.log(e)
      toast.error(
        "There was an error connecting to IPFS, please check your IPFS settings if applicable."
      );
      this.connectionStatus.next(false)
      loaderservice.setLoading(false)
      return false;
    }
  }

  async addToIpfs() {
    const connect = await this.setipfsHost()
    if(!connect){toast.error("Unable to connect to IPFS check your settings.",{autoClose:false}); return false;}
    loaderservice.setLoading(true)
    try {
      const result = await client.call('dGitProvider', 'push')
      console.log(result)
      this.cid = result;
      this.cidBehavior.next(this.cid);
      toast.success(`You files were uploaded to IPFS`);
      loaderservice.setLoading(false)
    } catch (e) {
      toast.error(
        "There was an error uploading to IPFS, please check your IPFS settings if applicable."
      );
      toast.error("There was an error uploading to IPFS!",{autoClose:false});
      loaderservice.setLoading(false)
      //Utils.log(e);
    }

    return true;
  }

  async importFromCID(cid: string | undefined, name:string = "") {
    toast.dismiss()
    const connect = await this.setipfsHost()
    if(!connect){toast.error("Unable to connect to IPFS check your settings.",{autoClose:false}); return false;}
    if (cid !== undefined) {
      //Utils.log("cid", cid);
      this.cid = cid;
      //$("#ipfs").val(ipfservice.cid);
      await ipfservice.clone();
    }
  }

  async clone() {
    await client.disableCallBacks()
    loaderservice.setLoading(true)
    const connect = await this.setipfsHost()
    if(!connect){toast.error("Unable to connect to IPFS check your settings.",{autoClose:false}); return false;}
    const cid = this.cid;
    //Utils.log(cid);
    if (cid === "" || typeof cid == "undefined" || !cid) {
      return false;
    }
    try {
      await client.call('dGitProvider', 'pull', cid)
      loaderservice.setLoading(false)
      //await fileservice.syncToBrowser();
      await fileservice.syncStart()
    } catch (e) {
      loaderservice.setLoading(false)
      await client.enableCallBacks()
      toast.error("This IPFS hash is probably not correct....",{autoClose:false});
    }
    
  }
}
