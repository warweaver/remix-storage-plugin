import { toast } from "react-toastify";
import FS from "@isomorphic-git/lightning-fs";
import App, {
  resetFileSystem,
  fileservice,
  fsNoPromise,
  gitservice,
  loaderservice,
} from "../../App";
import { client } from "../../App";
import path from "path";
import { fs } from "../../App";
import { removeSlash, jsonObjectFromFileList } from "./utils";
import { BehaviorSubject } from "rxjs";
import { fileExplorerNode, fileStatusResult, statusMatrix } from "./types";

export const fileStatuses = [
  ["new,untracked", 0, 2, 0], // new, untracked
  ["added,staged", 0, 2, 2], //
  ["added,staged, with unstaged changes", 0, 2, 3], // added, staged, with unstaged changes
  ["unmodified", 1, 1, 1], // unmodified
  ["modified,unstaged", 1, 2, 1], // modified, unstaged
  ["modified,staged", 1, 2, 2], // modified, staged
  ["modified,staged,with unstaged changes", 1, 2, 3], // modified, staged, with unstaged changes
  ["deleted,unstaged", 1, 0, 1], // deleted, unstaged
  ["deleted,staged", 1, 0, 0],
  ["deleted", 1, 1, 0], // deleted, staged
  ["unmodified", 1, 1, 3],
  ["deleted,not in git", 0, 0, 3],
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
  confirmDeletion = new BehaviorSubject<boolean | undefined>(undefined);
  fileStatusResult: fileStatusResult[] = [];

  constructor() {}

  async addFileFromBrowser(file: string) {
    try {
      const content = await client.call("fileManager", "readFile", file);
      console.log(content);
      await this.addFile(file, content);
      //return content
    } catch (e) {}
  }

  // RESET FUNCTIONS

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

  async clearFilesInWorkSpace() {
    await client.disableCallBacks();
    await this.clearFilesInIde();
    await this.clearFilesInWorkingDirectory();
    await this.showFiles();
    await client.enableCallBacks();
  }

  async clearFilesInIde() {
    var dirs = await client.call("fileManager", "readdir", "/");
    console.log(dirs);
    let files = await this.getDirectoryFromIde("/");
    console.log("FILES", files);
    for (let i = 0; i < files.length; i++) {
      try {
        await client.call("fileManager", "remove", files[i]);
      } catch (e) {}
    }
    files = await this.getDirectoryFromIde("/", true);
    console.log("DIRECTORY", files);
    for (let i = 0; i < files.length; i++) {
      try {
        await client.call("fileManager", "remove", files[i]);
      } catch (e) {}
    }
    return true;
  }

  async clearFilesInWorkingDirectory() {
    // files in FS
    const files = await gitservice.getStatusMatrixFiles();
    for (let i = 0; i < files.length; i++) {
      await this.rmFile(files[i]);
    }
  }

  async startNewRepo() {
    await resetFileSystem(true);
    await this.syncFromBrowser();
    await gitservice.init();
    await gitservice.clearRepoName();
  }

  async syncStart() {
    //await resetFileSystem();
    await this.clearFilesInWorkingDirectory();
    await this.syncFromBrowser();
    await gitservice.init();
  }

  async clearLocalAndSyncFromBrowser() {
    await this.clearFilesInWorkingDirectory();
    await this.syncFromBrowser();
  }

  async clearAll() {
    await this.clearFilesInWorkSpace();
    await resetFileSystem(true);
    await gitservice.clearRepoName();
  }

  // SYNC FUNCTIONS

  async syncToBrowser() {
    //this.showspinner();
    loaderservice.setLoading(true);
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
        loaderservice.setLoading(false);
      }
      filesToSync.push(ob);
    }
    console.log("files to sync", filesToSync);

    await this.showFiles();
    await client.enableCallBacks();
    toast.success("Import successfull");
    loaderservice.setLoading(false);
  }

  async syncFromBrowser() {
    await client.disableCallBacks();
    /// remove the files in the working area

    /// get files from ID and sync them
    let files = await this.getDirectoryFromIde("/");

    console.log(files);
    for (let i = 0; i < files.length; i++) {
      await this.addFileFromBrowser(files[i]);
    }
    await this.showFiles();
    await client.enableCallBacks();
  }

  async addFile(file: string, content: string) {
    console.log("add file ", file);
    const directories = path.dirname(file);
    await this.createDirectoriesFromString(directories);
    console.log(fs);
    await fs.writeFile("/" + file, content);
  }

  async rmFile(file: string) {
    try {
      console.log("rm file ", file);
      await fs.unlink("/" + file);
    } catch (e) {}
    //await this.showFiles();
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
    console.log("view file", filename);
    //$(args[0].currentTarget).data('file')
    try {
      await client.call("fileManager", "open", `${removeSlash(filename)}`);
    } catch (e) {
      toast.error("file does not exist in Remix");
    }
  }

  async getFileStatusMatrix() {
    this.fileStatusResult = await gitservice.statusMatrix();
    console.log("STATUS MATRIX", this.fileStatusResult);
    // let filesinstaging = await gitservice.listFilesInstaging();
    // console.log("FILES IN STAGING", filesinstaging);
    // let filesingit = await gitservice.listFiles();
    // console.log("FILES IN GIT", filesingit);

    this.fileStatusResult.map((m) => {
      statusmatrix.map((sm) => {
        if (JSON.stringify(sm.status) === JSON.stringify(m.status)) {
          console.log(m, sm);
          m.statusNames = sm.matrix;
        }
      });
    });
    //console.log("file status", this.fileStatusResult);
  }

  getFilesByStatus(status: string) {
    let count = 0;
    console.log("STATUS?", status);
    this.fileStatusResult.map((m) => {
      console.log("STATUS?", m);
      if (m.statusNames !== undefined) {
        if (m.statusNames?.indexOf(status) > -1) {
          count++;
          console.log("COUNT", count);
        }
      }
    });
    return count;
  }

  getFileStatusForFile(filename: string) {
    //console.log("checking file status", filename);
    for (let i: number = 0; i < this.fileStatusResult.length; i++) {
      if (this.fileStatusResult[i].filename === filename)
        return this.fileStatusResult[i].statusNames;
    }
  }

  async showFiles() {
    //$('#files').show()
    //$('#diff-container').hide()
    let files = await gitservice.getStatusMatrixFiles(); //await this.getDirectory("/");
    console.log("get directory result", files);

    try {
      await this.getFileStatusMatrix();
      let jsonfiles = await jsonObjectFromFileList(files);
      console.log("files", jsonfiles);
      this.filetreecontent.next(jsonfiles);
    } catch (e) {
      console.log(e);
    }
    try {
      await gitservice.gitlog();
    } catch (e) {}
    try {
      await gitservice.getBranches();
    } catch (e) {}
    //await gitservice.diffFiles()
    return true;
  }

  async getDirectory(dir: string) {
    console.log("get directory");
    let result: string[] = [];
    const files = await fs.readdir(`${dir}`);
    console.log(files);

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
    console.log(result);
    return result;
  }

  async getDirectoryFromIde(dir: string, onlyDirectories: boolean = false) {
    console.log("get directory", dir);
    let result: string[] = [];
    const files = await client.call("fileManager", "readdir", dir);
    console.log(files);

    let fileArray = Object.keys(files).map(function (i: any) {
      // do something with person
      return { filename: i, data: files[i] };
    });

    console.log(fileArray);

    for (let i = 0; i < fileArray.length; i++) {
      const fi: any = fileArray[i];
      if (typeof fi !== "undefined") {
        //console.log('looking into ', fi, dir)
        //if (dir === "/") dir = "";
        //dir = removeSlash(dir)
        const type = fi.data.isDirectory;
        //console.log("type",type)
        if (type === true) {
          //console.log('is directory, so get ', `${fi.filename}`)
          if (onlyDirectories === true) result.push(`browser/${fi.filename}`);
          result = [
            ...result,
            ...(await this.getDirectoryFromIde(
              `${fi.filename}`,
              onlyDirectories
            )),
          ];
        } else {
          // console.log('is file ', `${dir}/${fi}`)
          if (onlyDirectories === false) result.push(`browser/${fi.filename}`);
        }
      }
    }

    console.log(result);
    return result;
  }
}
