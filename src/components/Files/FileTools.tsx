import React from 'react'
import { fileservice, localipfsstorage } from '../../App'

interface FileToolsProps {

}

export const FileTools: React.FC<FileToolsProps> = ({}) => {
        return (
        <>
        <hr/>
        <button className="btn btn-danger w-10 d-none" onClick={async()=>fileservice.getDirectory("/")}>get dir</button>
        <button className="btn btn-danger w-10 d-none" onClick={async()=>fileservice.syncFromBrowser()}>Sync from IDE</button>
        <button className="btn btn-primary w-10 ml-2" onClick={async()=>fileservice.startNewRepo()}>Start new repo</button> |
        <button className="btn btn-danger w-10 ml-2" onClick={async()=>fileservice.clearAll()}>Clear all files & git</button>
        <button className="btn btn-danger w-10 ml-2" onClick={async()=>fileservice.clearFilesInWorkSpace()}>Clear files in browser</button>

        <button className="btn btn-danger w-10 d-none" onClick={async()=>fileservice.showFiles()}>show files</button>

        <button className="btn btn-danger w-10" onClick={async()=>localipfsstorage.init()}>show config</button>
        </>
        );
}