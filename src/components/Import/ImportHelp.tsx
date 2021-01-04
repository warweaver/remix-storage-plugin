import { faInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'

interface ImportHelpProps {

}

export const ImportHelp: React.FC<ImportHelpProps> = ({}) => {
    return (<div className="">
    <hr></hr>
    <div className='mt-4'>
    <FontAwesomeIcon icon={faInfo} className="mr-2" /><br></br>
    The plugin offers you 3 ways to import your files:<br></br>
- Just enter an IPFS hash where you stored the files.<br></br>
- Choose an export from the local storage, these are exports you made previously.<br></br>
- 3Box contains a list of exports you made earlier using the plugin's export to 3Box functionality.<br>
    </br><br></br>
    3Box stores the list of IPFS hashes and links it to your address.<br></br>
    For this to work you need to use a walletconnect app or metamask.<br></br>
    It also requires remix to run on https.<br></br>
    <a target='_blank' href='https://3box.io/'>More about 3Box here</a>
    </div>
    <br></br>
    <br></br>
    </div>);
}