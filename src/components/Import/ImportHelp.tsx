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
- Pinata Cloud.<br></br>
- Choose an export from the local storage, these are exports you made previously.<br></br>
    <br></br>
    <br></br>
    </div></div>);
}