import IpfsHttpClient from "ipfs-http-client";
import { toast } from "react-toastify";
import { BehaviorSubject } from "rxjs";
import { resetFileSystem, fileservice, fs, gitservice, ipfservice, loaderservice, client, Utils } from "../../App";

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

  showspinner() {}

  hidespinner() {}

  async setipfsHost() {
    this.ipfs = IpfsHttpClient(this.ipfsconfig);
    try {
      await this.ipfs.config.getAll();
      //toast.success(
      //  "IFPS Connection successfull!"
      //);
      this.connectionStatus.next(true)
      return true;
    } catch (e) {
      //Utils.log("IPFS error", e);

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
    this.filesToSend = [];
    // first get files in current commit, not the files in the FS because they can be changed or unstaged

    let filescommited;
    try {
      filescommited = await gitservice.listFiles();
    } catch (e) {
      toast.error("No files commited",{autoClose:false});
      loaderservice.setLoading(false)
      return false;
    }
    const currentcommitoid = await gitservice.getCommitFromRef("HEAD");
    for (let i = 0; i < filescommited.length; i++) {
      const ob: ipfsFileObject = {
        path: filescommited[i],
        content: await gitservice.getFileContentCommit(
          filescommited[i],
          currentcommitoid
        ),
      };
      this.filesToSend.push(ob);
    }
    //Utils.log(this.filesToSend);
    //return true;

    // then we get the git objects folder
    const files = await fileservice.getDirectory("/.git");
    //Utils.log("files to send", files, files.length);

    for (let i = 0; i < files.length; i++) {
      const fi = files[i];
      //Utils.log("fetching ", fi);
      const ob = {
        path: fi,
        content: await fs.readFile(fi),
      };
      this.filesToSend.push(ob);
    }

    let connected = await this.setipfsHost();
    if (!connected) return false;

    const addOptions = {
      wrapWithDirectory: true,
    };
    try {
      await this.ipfs.add(this.filesToSend, addOptions).then((x) => {
        //Utils.log(x.cid.string);
        /* $('#CID').attr('href', `${ipfsurl}${x.cid.string}`)
            $('#CID').html(`Your files are here: ${x.cid.string}`) */
        this.cid = x.cid.string;
        this.cidBehavior.next(this.cid);
      });
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
      gitservice.reponameSubject.next(name)
      gitservice.reponame = name
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
    // return true;
    await resetFileSystem()
    //await gitservice.init()
    await fileservice.clearFilesInIde()
    //Utils.log("cloning");
    let connected = await this.setipfsHost();
    if (!connected) return false;

    try {
      for await (const file of this.ipfs.get(cid)) {
        file.path = file.path.replace(cid, "");
        //Utils.log(file.path);
        if (!file.content) {
          //
          //Utils.log("CREATE DIR", file.path);
          await fileservice.createDirectoriesFromString(file.path);
          continue;
        }
        //Utils.log("CREATE FILE", file.path);
        const content = [];
        for await (const chunk of file.content) {
          content.push(chunk);
        }
        await fs.writeFile(file.path, content[0] || new Uint8Array());
      }
      loaderservice.setLoading(false)
      await fileservice.syncToBrowser();
      await fileservice.syncStart()
    } catch (e) {
      loaderservice.setLoading(false)
      await client.enableCallBacks()
      toast.error("This IPFS hash is probably not correct....",{autoClose:false});
    }
    
  }
}
