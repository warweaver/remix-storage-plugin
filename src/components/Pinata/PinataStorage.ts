import { BehaviorSubject } from "rxjs";
import { client, gitservice, ipfservice, Utils } from "../../App";
import { boxObject } from "../3box/3boxService";
import { default as dateFormat } from "dateformat";
import { toast } from "react-toastify";
import { useBehaviorSubject } from "../usesubscribe";
export class PinataStorage {
  boxObjects = new BehaviorSubject<any[] | []>([]);
  objects: any[] = [];

  async init() {
    try {
      await this.read();
    } catch (e) {
      //Utils.log(e);
    }
  }

  async read() {
    try {
      try {
        let r = await client.call(
          "dGitProvider" as any,
          "pinList",
          ipfservice.pinataConfig.key,
          ipfservice.pinataConfig.secret
        );

        console.log(r);
      } catch (err) {
        console.log(err);
      }
      //this.objects = r? JSON.parse(r):[];
      //Utils.log("READ CONFIG",this.objects);
    } catch (e) {}
  }
}
