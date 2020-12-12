import React from 'react'
import { useBehaviorSubject } from 'use-subscribable';
import { walletservice } from '../../App';


interface IPFSViewProps {

}

export const WalletView: React.FC<IPFSViewProps> = ({}) => {
        
        const address = useBehaviorSubject(walletservice.addressBehavior)

        walletservice.addressBehavior.subscribe((x)=>{}).unsubscribe()

        return (
                <>
                <hr/>
                <div className="alert alert-info">Connect to your wallet first, then connect to 3Box using your wallet account.</div>
                <button onClick={async()=>walletservice.openModal()} className="btn w-25 btn-primary" id="wallet-btn">wallet connect</button>
                <div id="ethAddress">{address?<div className="alert alert-success mt-2 w-25">Your address is {address}</div>:<div>Not connected</div>}</div>
                <hr/>
                </>
        );
}