import { default as Box } from "3box";
import { toast } from "react-toastify";
import { BehaviorSubject } from "rxjs";
import { gitservice, ipfservice } from "../../App";

export class BoxService {
  status = new BehaviorSubject<boolean>(false)
  box: any;
  space: any;

  showspinner() {}

  hidespinner() {}
  // 3BOX connection

  async setSpace(space:any){
    this.space = space
  }

  async storeHashIn3Box(space:any) {
    if (typeof this.space == "undefined") {
      toast.warning("You should connect to 3Box first");
      return false;
    }
    this.showspinner();
    await ipfservice.addToIpfs();
    console.log("export 3box", ipfservice.cid, this.space);
    const commits = await gitservice.getCommits();
    let key = `remixhash-${Date.now()}`;
    await this.space.private.set(key, {
      key: key,
      cid: ipfservice.cid,
      datestored: new Date(Date.now()),
      datecommit: commits[0].commit.committer.timestamp,
      ref: commits[0].oid,
      message: commits[0].commit.message,
    });
    toast.success("stored in 3box");
    //this.addSuccess('boxexportstatus', 'Your data was stored in 3Box')
    const hashes = await this.getHashesFrom3Box(space);
    await this.show3boxhashes(hashes);
    this.hidespinner();
  }

  async show3boxhashes(hashes: any) {
    console.log("render", hashes);

    let ipfsurl = await ipfservice.getipfsurl();
    hashes.map(async (x: any) => {
      try {
        x.link = `${ipfsurl}${x.cid}`;
        return x;
      } catch (e) {
        return false;
      }
    });

    hashes = hashes.reverse();
  }

  async getHashesFrom3Box(space:any) {
    const hashes = await space.private.all();
    console.log(hashes);
    return Object.values(hashes);
  }

  async importFrom3Box(args: string) {
    const cid = args;
    console.log("cid", cid);
    ipfservice.cid = cid;
    //$("#ipfs").val(ipfservice.cid);
    //await this.clone();
  }

  async deleteFrom3Box(args: string, space:any) {
    const key = args;
    console.log("key", key);
    this.showspinner();
    await this.space.private.remove(key);
    const hashes = await this.getHashesFrom3Box(space);
    await this.show3boxhashes(hashes);
    this.hidespinner();
  }
}
