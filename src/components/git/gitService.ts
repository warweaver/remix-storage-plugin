import git, { ReadCommitResult } from "isomorphic-git";
import { fileservice, fs, fsNoPromise } from "../../App";
import { toast } from "react-toastify";
import path from "path";
import { removeSlash } from "../Files/utils";
import { BehaviorSubject } from "rxjs";
import { fileStatuses } from "../Files/FileService";

export interface diffObject {
  originalFileName: string;
  updatedFileName: string;
  past: string;
  current: string;
}
export class gitService {
  commits = new BehaviorSubject<ReadCommitResult[] | undefined>(undefined);
  branch = new BehaviorSubject<string>("");
  branches = new BehaviorSubject<string[] | undefined>(undefined);
  diffResult = new BehaviorSubject<diffObject[] | undefined>(undefined);
  reponame = new BehaviorSubject<string>("");

  constructor() {
    this.init();
  }

  async init() {
    await git.init({
      fs: fsNoPromise,
      dir: "/",
      defaultBranch: "master",
    });
    toast.info(`Git version ${git.version()}`);

    await fileservice.showFiles();
  }

  async clearRepoName(){
    this.reponame.next("")
  }

  async addToGit(args: string | undefined) {
    if (args !== undefined) {
      //console.log('ADD TO GIT', $(args[0].currentTarget).data('file'))
      const filename = args; // $(args[0].currentTarget).data('file')
      const basename = path.basename(filename);
      const directory = path.dirname(filename);
      console.log("will add", basename, directory);

      await git.add({
        fs: fsNoPromise,
        dir: "/",
        filepath: removeSlash(filename),
      });
      await fileservice.showFiles();
      toast.success(`Added file ${filename}`);
    }
  }

  async gitrm(args: any) {
    //console.log('RM GIT', $(args[0].currentTarget).data('file'))
    const filename = args; // $(args[0].currentTarget).data('file')

    await git.remove({
      fs: fsNoPromise,
      dir: "/",
      filepath: removeSlash(filename),
    });
    await fileservice.showFiles();
    toast.success(`Removed file file ${filename}`);
  }

  async checkoutfile(args: any) {
    const filename = ""; //$(args[0].currentTarget).data('file')
    console.log("checkout", filename);

    try {
      await git.checkout({
        fs: fsNoPromise,
        dir: "/",
        filepaths: [`/${filename}`],
      });
    } catch (e) {
      console.log(e);
      //this.addAlert("checkoutMessage", e)
    }
    console.log("done");
    await fileservice.syncToBrowser();
  }

  async checkout(args: string) {
    const oid = args; //$(args[0].currentTarget).data('oid')
    console.log("checkout", oid);

    try {
      await git.checkout({
        fs: fsNoPromise,
        dir: "/",
        ref: oid,
      });

      this.gitlog();
    } catch (e) {
      console.log(e);
      toast.error(" " + e);
    }

    console.log("done");
    await fileservice.syncToBrowser();
  }

  async getCommits() {
    console.log("get commits");
    try {
      const commits: ReadCommitResult[] = await git.log({
        fs: fsNoPromise,
        dir: "/",
        depth: 200,
      });
      return commits;
    } catch (e) {
      throw e;
    }
  }

  async gitlog() {
    console.log("log");
    try {
      const commits: ReadCommitResult[] = await this.getCommits();
      this.commits.next(commits);
      console.log(commits);
    } catch (e) {
      this.commits.next([]);
      console.log(e);
    }

    await this.showCurrentBranch();
  }

  async createBranch(name: string = "") {
    const branch = name; //|| $("#newbranchname").val();
    if (branch)
      await git.branch({
        fs: fsNoPromise,
        dir: "/",
        ref: branch,
      });

    fileservice.showFiles();
  }

  async showCurrentBranch() {
    try {
      const branch = await this.currentBranch();
      const currentcommitoid = await this.getCommitFromRef("HEAD");
      this.branch.next(branch);
      if (typeof branch === "undefined" || branch === "") {
        toast.warn(`You are in a detached state`);
        this.branch.next(`HEAD detached at ${currentcommitoid}`);
      } else {
        this.branch.next(`Branch is: ${branch} at commit ${currentcommitoid}`);
      }
    } catch (e) {}
  }

  async getLastCommmit() {
    try {
      let currentcommitoid = "";
      currentcommitoid = await this.getCommitFromRef("HEAD");
      return currentcommitoid;
    } catch (e) {
      return false;
    }
  }

  async currentBranch() {
    try {
      const branch: string =
        (await git.currentBranch({
          fs: fsNoPromise,
          dir: "/",
          fullname: false,
        })) || "";
      console.log("BRANCH", branch);
      return branch;
    } catch (e) {
      throw e;
    }
  }

  async commit(message: string = "") {
    const sha = await git.commit({
      fs: fsNoPromise,
      dir: "/",
      author: {
        name: "Remix Workspace",
        email: "",
      },
      message: message, //$('#message').val()
    });
    toast.success(`Commited: ${sha}`);
    await fileservice.showFiles();
  }

  async getBranches() {
    let branches: string[] = await git.listBranches({
      fs: fsNoPromise,
      dir: "/",
    });
    this.branches.next(branches);
  }

  async getCommitFromRef(ref: string) {
    const commitOid = await git.resolveRef({
      fs: fsNoPromise,
      dir: "/",
      ref: ref,
    });
    return commitOid;
  }

  async getFileContentCommit(fullfilename: string, commitOid: string) {
    let content = "";
    try {
      const { blob } = await git.readBlob({
        fs: fsNoPromise,
        dir: "/",
        oid: commitOid,
        filepath: removeSlash(fullfilename),
      });
      content = Buffer.from(blob).toString("utf8");
    } catch (e) {
      console.log(e);
    }
    return content;
  }

  async statusMatrix(dir: string = "/", ref: string = "HEAD") {
    const matrix = await git
      .statusMatrix({
        fs: fsNoPromise,
        dir: "/",
      })
      .catch((e) => {});

    let result = (matrix || []).map((x) => {
      return {
        filename: `/${x.shift()}`,
        status: x,
      };
    });
    return result;
  }

  async getStatusMatrixFiles() {
    let files = await (await this.statusMatrix()).map((f) => {
      return f.filename;
    });
    return files;
  }

  async listFiles(dir: string = "/", ref: string = "HEAD") {
    let filescommited = await git.listFiles({
      fs: fsNoPromise,
      dir: dir,
      ref: ref,
    });
    return filescommited;
  }

  async listFilesInstaging(dir: string = "/") {
    let filesInStaging = await git.listFiles({
      fs: fsNoPromise,
      dir: dir,
    });
    return filesInStaging;
  }

  async addAll() {
    const statuses = fileservice.fileStatusResult;
    console.log(statuses);

    for (let i: number = 0; i < statuses.length; i++) {
      await this.addToGit(statuses[i].filename);
    }
  }

  async diffFiles() {
    const statuses = fileservice.fileStatusResult;
    console.log(statuses);
    const diffs: diffObject[] = [];
    for (let i: number = 0; i < statuses.length; i++) {
      if ((statuses[i].statusNames?.indexOf("modified") || false) > -1) {
        console.log(statuses[i].statusNames?.indexOf("modified"));
        const diff: diffObject = await this.diffFile(statuses[i].filename);
        diffs.push(diff);
      }
    }
    this.diffResult.next(diffs);
  }

  async diffFile(args: any) {
    //$('#files').hide()
    //$('#diff-container').show()
    console.log("DIFF", args);
    const fullfilename = args; // $(args[0].currentTarget).data('file')
    try {
      const commitOid = await git.resolveRef({
        fs: fsNoPromise,
        dir: "/",
        ref: "HEAD",
      });

      const { blob } = await git.readBlob({
        fs: fsNoPromise,
        dir: "/",
        oid: commitOid,
        filepath: removeSlash(fullfilename),
      });

      const newcontent = await fs.readFile(fullfilename, {
        encoding: "utf8",
      });
      const original = Buffer.from(blob).toString("utf8");

      console.log(original);
      console.log(newcontent);
      //const filediff = createPatch(filename, original, newcontent); // diffLines(original,newcontent)
      //console.log(filediff)
      const filediff: diffObject = {
        originalFileName: fullfilename,
        updatedFileName: fullfilename,
        current: newcontent,
        past: original,
      };

      return filediff;
    } catch (e) {
      toast("Nothing to diff! " + fullfilename);

      const filediff: diffObject = {
        originalFileName: "",
        updatedFileName: "",
        current: "",
        past: "",
      };
      return filediff;
    }
  }
}
