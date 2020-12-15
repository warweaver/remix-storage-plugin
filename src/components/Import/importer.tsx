import React from "react";
import { LocalIPFSView } from "../LocalStorage/LocalIPFSView";
import { BoxImporter } from "./BoxImporter";
import { IPFSImporter } from "./IPFSImporter";



interface importerProps {}

export const Importer: React.FC<importerProps> = ({}) => {
  return (
    /* 
            <>

<h4>3Box storage</h4>
<div className="alert alert-info" role="alert">This will import the IPFS repo from a key stored in your 3Box account.
</div>
<div className="container-fluid">

    <div className="row p-1 small">
        <div className="col-4">
            IPFS: <a target="_blank" href="{{link}}">{{cid}}</a><br>
            DATE: {{datestored}}<br>
            DATE OF COMMIT: {{datecommit}}<br>
            MESSAGE: {{message}}<br>
            COMMIT: {{ref}}<br>
        </div>
        <div className="col">
            <button className="btn btn-primary btn-sm float-right import3b-btn float-right" data-cid="{{cid}}">
                import
            </button>
        </div>
        <div className="col">
            <button className="btn btn-danger btn-sm float-right delete3b-btn float-right" data-key="{{key}}">
                <span className="fas fa-trash"></span>
            </button>
        </div>
    </div>

</div>
            </> */
    <>
        <IPFSImporter/>
        <LocalIPFSView/>
        <BoxImporter/>
        
    </>
  );
};
