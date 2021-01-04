import { faInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import marked from "marked";

interface ConfigHelpProps {}

export const ConfigHelp: React.FC<ConfigHelpProps> = ({}) => {
  return (
    <div className="">
      <hr></hr>
      <div className="mt-4">
        <FontAwesomeIcon icon={faInfo} className="mr-2" />
        <br></br>
        By default the IPFS used is a node from the Remix team.<br></br>
        You can start your own IPFS daemon and set it to localhost in the config
        of the plugin.<br></br>
        However you need to configure your IPFS daemon to accept calls from a
        web app by setting the Access-control-allow or CORS headers.<br></br>
        Checkout the IPFS daemon documentation on how to do this.<br></br>
      </div>
      <br></br>
      <br></br>
    </div>
  );
};
