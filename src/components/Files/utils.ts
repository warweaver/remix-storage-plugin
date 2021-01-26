import path from "path";
import { Utils } from "../../App";
import { fileExplorerNode } from "./types";

export const removeSlash = (s: string) => {
  return s.replace(/^\/+/, "");
};

export const jsonObjectFromFileList = (files: string[]) => {
  const ob: fileExplorerNode[] = [];
  // reindex filelist
  files.map((f, i) => {
    const dirname = path.dirname(files[i]);
    if (dirname.startsWith("/.")) return true;
    const basename = path.basename(files[i]);
    const directories = removeSlash(dirname).split("/");
    let node: fileExplorerNode;
    if (
      !ob.find((x) => {
        return x.fullname === dirname;
      })
    ) {
      node = {
        type: "dir",
        dir: true,
        file: false,
        name: directories.pop(),
        fullname: dirname,
        parentDir: path.dirname(dirname),
      };
      ob.push(node);
    }

    let previouspath = "";
    for (let i = 0; i < directories.length; i++) {
      if (i > 0) previouspath = "/" + directories.slice(0, i).join("/");
      const finalPath = previouspath + "/" + directories[i];
      if (
        !ob.find((x) => {
          return x.fullname === finalPath;
        })
      ) {
        node = {
          type: "dir",
          dir: true,
          file: false,
          name: directories[i],
          fullname: finalPath,
          parentDir: path.dirname(finalPath),
        };
        ob.push(node);
      }
    }
    if (
      !ob.find((x) => {
        return x.fullname === files[i];
      })
    ) {
      node = {
        type: "file",
        file: true,
        dir: false,
        name: basename,
        fullname: files[i],
        directory: dirname,
        status: [],
      };
      ob.push(node);
    }
  });
  // asign ids
  ob.map((f, i) => {
    f.id = i;
  });
  // find parents
  ob.map((f, i) => {
    f.parentId = null;
    f.children = null;
    if (f.type === "file") {
      // f.parent

      const parent = ob.find((x) => {
        return x.fullname === f.directory && x.type === "dir";
      });
      f.parentId = parent ? parent.id : null;
    } else {
      ////Utils.log(f)
      const parent = ob.find((x) => {
        return x.fullname === f.parentDir && x.type === "dir";
      });
      f.parentId = parent ? parent.id : null;
    }
  });
  //Utils.log("build tree from", ob.sort(sortbydirectorylevel));
  // first we need it sorted
  const nest = (items: any, id = null, link = "parentId") =>
    items
      .filter((item: any) => item[link] === id)
      .map((item: any) => ({
        ...item,
        children: nest(items, item.id),
      }));

  //Utils.log("build tree from", ob);

  let t: fileExplorerNode[] = nest(ob);

  let result: fileExplorerNode = {
    children: t,
  };
  // //Utils.log('OB', ob)
  return result;
};

const sortbydirectorylevel = (a: any, b: any) => {
  ////Utils.log(a,b);
  if (a.fullname.split("/").length < b.fullname.split("/").length) {
    return -1;
  }
  if (a.fullname.split("/").length > b.fullname.split("/").length) {
    return 1;
  }
  return 0;
};
