import { toast } from "react-toastify";
import { BehaviorSubject } from "rxjs";
import { gitservice, ipfservice, loaderservice, localipfsstorage } from "../../App";

export interface boxObject {
  key?: string;
  cid?: string;
  datestored?: string | number | Date;
  datecommit?: number | string | Date;
  timestamp: number;
  ref?: string;
  message?: string;
  links?: string;
}
export class BoxService {
  status = new BehaviorSubject<boolean>(false);
  boxObjects = new BehaviorSubject<boxObject[] | []>([]);
  box: any;
  space: any;

  showspinner() {}

  hidespinner() {}
  // 3BOX connection

  async setSpace(space: any) {
    this.space = space;
  }

  async storeHashIn3Box(space: any) {
    if (typeof this.space == "undefined") {
      toast.error("You should connect to 3Box first");
      return false;
    }
    loaderservice.setLoading(true)
    await ipfservice.addToIpfs();
    console.log("export 3box", ipfservice.cid, this.space);

    const ob = await localipfsstorage.createBoxObject()

    await this.space.private.set(ob.key, ob);
    toast.success("Stored in 3box");
    await this.getObjectsFrom3Box(space);
    loaderservice.setLoading(false)
  }

  async getObjectsFrom3Box(space: any) {
    console.log("get objects from box");
    const hashes: boxObject[] = await space.private.all();
    this.boxObjects.next(Object.values(hashes));
    console.log(hashes);
    return Object.values(hashes);
  }

  async deleteFrom3Box(args: string | undefined) {
    if (args !== undefined) {
      const key = args;
      console.log("key", key);
      loaderservice.setLoading(true)
      await this.space.private.remove(key);
      await this.getObjectsFrom3Box(this.space);
      loaderservice.setLoading(false)
    }
  }
}
