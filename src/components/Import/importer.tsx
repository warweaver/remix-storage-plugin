import React from "react";
import { LocalIPFSView } from "../LocalStorage/LocalIPFSView";
import { BoxImporter } from "./BoxImporter";
import { IPFSImporter } from "./IPFSImporter";



interface importerProps {}

export const Importer: React.FC<importerProps> = ({}) => {
  return (
    <>
        <IPFSImporter/>
        <LocalIPFSView/>
        <BoxImporter/>
        
    </>
  );
};
