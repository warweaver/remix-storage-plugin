export type fileExplorerNode = {
    children?: ( fileExplorerNode[] | null );
    dir?: boolean;
    file?: boolean;
    fullname?: string;
    id?: number;
    name?: string;
    parentDir?: string;
    parentId?: ( number | null );
    type?: string;
    directory?:string
    status?:any[]
  };

  export type fileStatusResult = {
      filename:string,
      status?: fileStatus
      statusNames?:string[]
  }

  export type fileStatus =[string, 0 | 1, 0 | 1 | 2, 0 | 1 | 2 | 3]

  export type statusMatrix = { matrix: string[] | undefined; status: string[] }

  