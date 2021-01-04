import { faInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'

interface GitHelpProps {

}

export const GitHelp: React.FC<GitHelpProps> = ({}) => {
    return (<div className="">
    <hr></hr>
    <div className='mt-4'>
    <FontAwesomeIcon icon={faInfo} className="mr-2" /><br></br>
    In this section you can manage your git repo like you normally would. Start by creating a first commit.<br></br>
    Push & pull is not included here, go to the export/import section.<br></br>
    </div>
    <br></br>
    <br></br>
    </div>);
}