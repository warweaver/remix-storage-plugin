import React from "react";
import { LocalIPFSView } from "../LocalStorage/LocalIPFSView";

import { IPFSImporter } from "./IPFSImporter";
import { PinataImport } from "./PinataImport";



interface importerProps {}

export const Importer: React.FC<importerProps> = ({}) => {
  return (
    <>
        <IPFSImporter/>
        <PinataImport></PinataImport>
        <LocalIPFSView/>
    </>
  );
};
