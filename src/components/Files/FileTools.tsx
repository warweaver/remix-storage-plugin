import React from 'react'
import { fileservice } from '../../App'

interface FileToolsProps {

}

export const FileTools: React.FC<FileToolsProps> = ({}) => {
        return (
        <>
        <hr/>
        <button className="btn btn-danger w-10" onClick={async()=>fileservice.clearDb()}>Clear files</button>
        </>
        );
}