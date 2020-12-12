import IpfsHttpClient from "ipfs-http-client";
import { toast } from "react-toastify";
import { BehaviorSubject } from "rxjs";
import { fileservice, fs, gitservice } from "../../App";

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
    host: "localhost",
    port: 5001,
    protocol: "http",
    ipfsurl: "https://ipfs.io/ipfs/",
  };

  ipfs = IpfsHttpClient(this.ipfsconfig);
  filesToSend: ipfsFileObject[] = [];
  cid: string = "";
  cidBehavior = new BehaviorSubject<string>("")

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

      return true;
    } catch (e) {
      console.log("IPFS error", e);

      toast.error(
        "There was an error connecting to IPFS, please check your IPFS settings if applicable."
      );

      this.hidespinner();
      return false;
    }
  }

  async addToIpfs() {
    this.showspinner();
    this.filesToSend = [];
    // first get files in current commit, not the files in the FS because they can be changed or unstaged

    let filescommited;
    try {
      filescommited = await gitservice.listFiles();
    } catch (e) {
      toast.warning("No files commited");
      this.hidespinner();
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
    console.log(this.filesToSend);
    //return true;

    // then we get the git objects folder
    const files = await fileservice.getDirectory("/.git");
    console.log("files to send", files, files.length);

    for (let i = 0; i < files.length; i++) {
      const fi = files[i];
      console.log("fetching ", fi);
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
        console.log(x.cid.string);
        /* $('#CID').attr('href', `${ipfsurl}${x.cid.string}`)
            $('#CID').html(`Your files are here: ${x.cid.string}`) */
        this.cid = x.cid.string;
        this.cidBehavior.next(this.cid)
      });
      toast.success(
        `You files were uploaded to IPFS`
      );
      this.hidespinner();
    } catch (e) {
      toast.error(
        "There was an error uploading to IPFS, please check your IPFS settings if applicable."
      );
      toast.error("There was an error uploading to IPFS!");
      this.hidespinner();
      console.log(e);
    }

    return true;
  }
}
