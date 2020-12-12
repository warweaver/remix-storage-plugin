import React from 'react'
import './FileExplorer.css'
interface StatusButtonProps {
    statuses?:string[]
}

export const StatusButtons: React.FC<StatusButtonProps> = ({statuses}:StatusButtonProps) => {
    return <span className="buttons float-right">
    {statuses?.map(item=>{
        return <span key={item} className={`badge ml-1 badge-secondary ${item}`}>{item}</span>
    })}
    </span>
}