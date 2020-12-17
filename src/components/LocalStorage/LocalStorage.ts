import { unstable_batchedUpdates } from "react-dom";
import { BehaviorSubject } from "rxjs";
import { fsConfigPromise, gitservice, ipfservice } from "../../App";
import { boxObject } from "../3box/3boxService";
import { default as dateFormat } from 'dateformat'
export class LocalIPFSStorage {
  boxObjects = new BehaviorSubject<boxObject[] | []>([]);
  objects: any[] = [];

  async init() {
    try {
      await this.read();
    } catch (e) {
      console.log(e);
      await this.write();
    }
  }

  async read() {
    let r = await fsConfigPromise.readFile("/objects.json", {
      encoding: "utf8",
    });
    this.objects = JSON.parse(r);
    this.objects.sort((a, b) => (a.datecommit > b.datecommit) ? -1 : 1)
    this.objects = await this.filterNulls();
    console.log("READ CONFIG",this.objects);
    this.boxObjects.next(this.objects);
  }

  async write() {
    await fsConfigPromise.writeFile(
      "/objects.json",
      JSON.stringify(await this.filterNulls()),
      { encoding: "utf8" }
    );
  }

  async addToStorage(box: boxObject) {
    await this.init();
    await this.deleteFromStorage(box.cid)
    this.objects.push(box);
    await this.write();
    await this.read();
  }

  async filterNulls() {
    var filtered = this.objects.filter(function (el) {
      return el != null;
    });
    return filtered;
  }

  async deleteFromStorage(cid: string | undefined) {
    if (cid !== undefined) {
      await this.read();
      this.objects = this.objects.filter((i) => i.cid !== cid);
      await this.write();
      await this.read();
    }
  }

  async createBoxObject() {
    await this.init();
    const commits = await gitservice.getCommits();
    let key = gitservice.reponame;

    let ob: boxObject = {
      key: key,
      cid: ipfservice.cid,
      datestored: dateFormat(new Date(),"dddd, mmmm dS, yyyy, h:MM:ss TT"),
      datecommit: dateFormat(new Date(commits[0].commit.committer.timestamp * 1000), "dddd, mmmm dS, yyyy, h:MM:ss TT"),
      timestamp: commits[0].commit.committer.timestamp,
      ref: commits[0].oid,
      message: commits[0].commit.message,
    };

    return ob;
  }
}
