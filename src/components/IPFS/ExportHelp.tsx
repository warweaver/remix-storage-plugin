import { faInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'

interface ExportHelpProps {

}

export const ExportHelp: React.FC<ExportHelpProps> = ({}) => {
    return (<div className="">
    <hr></hr>
    <div className='mt-4'>
    <FontAwesomeIcon icon={faInfo} className="mr-2" /><br></br>
    The plugin offers you 3 ways to export your files:<br></br>
- You just store the git repo in IPFS and keep the hash somewhere for later use<br></br>
- You store the git repo in IPFS and your browser keeps a list of your hashes<br></br>
- You store the git repo in IPFS and you export the hash to a list in 3Box.io.<br>
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