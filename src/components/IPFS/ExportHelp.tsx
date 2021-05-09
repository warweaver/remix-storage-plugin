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
    The plugin offers you 2 ways to export your files:<br></br>
    - You export your files the Pinata Cloud IPFS<br></br>
    Pinata offers a 'pinning' service for IPFS, up to 1GB of free pinning.<br></br>
- You store the git repo in a custom IPFS gateway<br></br>
    <a target='_blank' href='https://pinata.cloud/'>Sign up for a Pinata account here</a>
    </div>
    <br></br>
    <br></br>
    </div>);
}