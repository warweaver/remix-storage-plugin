import { toast } from "react-toastify";
import { gitservice } from "../../App";
import { client } from "../../App";
import path from "path";
import { fs } from "../../App";
import { removeSlash, jsonObjectFromFileList } from "./utils";
import { BehaviorSubject } from "rxjs";
import {
  fileExplorerNode,
  fileStatusResult,
  statusMatrix,
} from "./types";

export const fileStatuses = [
  ["new, untracked", 0, 2, 0], // new, untracked
  ["added, staged", 0, 2, 2], //
  ["added, staged, with unstaged changes", 0, 2, 3], // added, staged, with unstaged changes
  ["unmodified", 1, 1, 1], // unmodified
  ["modified, unstaged", 1, 2, 1], // modified, unstaged
  ["modified, staged", 1, 2, 2], // modified, staged
  ["modified, staged, with unstaged changes", 1, 2, 3], // modified, staged, with unstaged changes
  ["deleted, unstaged", 1, 0, 1], // deleted, unstaged
  ["deleted, staged", 1, 0, 0], // deleted, staged
];

const statusmatrix: statusMatrix[] = fileStatuses.map((x: any) => {
  return {
    matrix: x.shift().split(","),
    status: x,
  };
});
console.log("matrix", statusmatrix);

export class LsFileService {
  filetreecontent = new BehaviorSubject<fileExplorerNode>({ children: [] });
  fileStatusResult: fileStatusResult[] = []

  async addFileFromBrowser(file: string) {
    if (!client.callBackEnabled) return false;
    const content = await client.call("fileManager", "readFile", file);
    console.log(content);
    await this.addFile(file, content);
    //return content
  }

  async clearDb() {
    const req = indexedDB.deleteDatabase("remix-workspace");

    let me = this;
    req.onsuccess = async function () {
      toast("Deleted database successfully");
      //await me.gitlog()
      await me.showFiles();
      await gitservice.init();
    };
  }

  async syncToBrowser() {
    //this.showspinner();
    await client.disableCallBacks();
    let filesToSync = [];
    // first get files in current commit, not the files in the FS because they can be changed or unstaged

    let filescommited = await gitservice.listFiles();
    const currentcommitoid = await gitservice.getCommitFromRef("HEAD");
    for (let i = 0; i < filescommited.length; i++) {
      const ob = {
        path: filescommited[i],
        content: await gitservice.getFileContentCommit(
          filescommited[i],
          currentcommitoid
        ),
      };
      console.log("sync file", ob);
      try {
        await client.call("fileManager", "setFile", ob.path, ob.content);
      } catch (e) {
        console.log("could not load file", e);
        //this.hidespinner();
      }
      filesToSync.push(ob);
    }
    console.log("files to sync", filesToSync);

    await this.showFiles();
    await client.enableCallBacks();
    toast("Import successfull");
    //this.hidespinner();
  }

  async addFile(file: string, content: string) {
    console.log("add file ", file);
    const directories = path.dirname(file);
    await this.createDirectoriesFromString(directories);
    console.log(fs);
    await fs.writeFile("/" + file, content);
    await this.showFiles();
  }

  async rmFile(file: string) {
    console.log("rm file ", file);
    await fs.unlink("/" + file);
    await this.showFiles();
  }

  async createDirectoriesFromString(strdirectories: string) {
    const ignore = [".", "/.", ""];
    console.log("directory", strdirectories, ignore.indexOf(strdirectories));
    if (ignore.indexOf(strdirectories) > -1) return false;
    let directories: string[] = strdirectories.split("/");
    console.log("create directory", directories);
    for (let i = 0; i < directories.length; i++) {
      console.log(directories[i]);
      let previouspath = "";
      if (i > 0) previouspath = "/" + directories.slice(0, i).join("/");
      const finalPath = previouspath + "/" + directories[i];
      console.log("creating ", finalPath);
      try {
        await fs.mkdir(finalPath);
      } catch (e) {
        // console.log(e)
      }
    }
  }

  async viewFile(args: any) {
    const filename = args; 
    console.log("view file",filename)
    //$(args[0].currentTarget).data('file')
    try{
      await client.call("fileManager", "switchFile", `${removeSlash(filename)}`);
    }catch(e){
      toast.error("file does not exist in Remix")
    }
  }

  async getFileStatusMatrix() {
    this.fileStatusResult = await gitservice.statusMatrix();
    this.fileStatusResult.map((m) => {
      statusmatrix.map((sm) => {
        if (JSON.stringify(sm.status) === JSON.stringify(m.status)) {
          console.log(m, sm);
          m.statusNames = sm.matrix;
        }
      });
    });
    console.log("file status", this.fileStatusResult);
  }

  getFileStatusForFile(filename:string){
    console.log("checking file status",filename)
    for(let i:number=0;i<this.fileStatusResult.length;i++){
      if(this.fileStatusResult[i].filename == filename) return this.fileStatusResult[i].statusNames
    }
  }

  async showFiles() {
    //$('#files').show()
    //$('#diff-container').hide()
    let files = await this.getDirectory("/");
    console.log("get directory result", files);

    try {
      await this.getFileStatusMatrix();
      let jsonfiles = await jsonObjectFromFileList(files);
      console.log("files", jsonfiles);
      this.filetreecontent.next(jsonfiles);
    } catch (e) {}

    try {
      await gitservice.gitlog();
    } catch (e) {}
    try {
      await gitservice.getBranches();
    } catch (e) {}
    await gitservice.diffFiles()
    return true;
  }

  async getDirectory(dir: string) {
    //console.log('get directory')
    let result: string[] = [];
    const files = await fs.readdir(`${dir}`);
    //console.log('readdir', files)
    // await files.map(async (fi)=>{
    for (let i = 0; i < files.length; i++) {
      const fi = files[i];
      if (typeof fi !== "undefined") {
        // console.log('looking into ', fi, dir)
        if (dir === "/") dir = "";
        const type = await fs.stat(`${dir}/${fi}`);
        if (type.type === "dir") {
          // console.log('is directory, so get ', `${dir}/${fi}`)
          result = [...result, ...(await this.getDirectory(`${dir}/${fi}`))];
        } else {
          // console.log('is file ', `${dir}/${fi}`)
          result.push(`${dir}/${fi}`);
        }
      }
    }

    // })
    return result;
  }
}
