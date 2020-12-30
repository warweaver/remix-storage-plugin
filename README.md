# Getting Started

## Requirements

- Run the IDE on HTTPS
- Do not run in icognito mode or block third party cookies

## What does it do?

This plugin tracks your files in Remix and allows you to store them in a git repository in IPFS.<br>
Each time you commit files and export them it will generate a new IPFS hash for you.<br>
In IPFS you will find your browser's files plus the git repository itself ( .git ).<br>
These hashes are stored in your browser's local storage or you can export them to 3Box.io.<br>

## Git operations

You have to use the app in the same way you would when you'd manage your files in a git repo.<br>
Files are not added by git automatically, you need to add, stage and commmit them like you would do normally.<br>
*Files that are not commmited will not be exported to IPFS!*

## Is 'export' the same as 'push'?

No, export creates a unique version in IPFS, because IPFS can't be updated.<br>So it's not called a push
although you keep your entire GIT repo with its history.

## Is 'Import' the same as 'pull'?

No, it will pull the repo from IPFS in its entirety and erase the files in Remix. It is basically always a 'clone'.

## File collaboration

You can share files by sharing the IPFS hash that was created when you exported.<br>
But each time you export a unique version is created in IPFS, so if someone else works on the files they will also export a unique version.<br>
This app does not replace GitHub when it comes to collaboration features.
## Do I need 3Box and what is it?

3Box allows you to store user information connected to your Metamask/Wallet address.<br>This means if you move around or clear your browser local storage you can still access your repo's by connecting to 3Box.

You do not need it to use this app. You can store your stuff in IPFS and local storage only if you do not plan to clear that or move around.

## How to connect to 3Box? Why does it take so long?

3Box uses your web3 address to store your data. This means you have to connect through Metamask or WalletConnect.<br>
The 3Box connection is pretty slow, be patient, let it work. It will timeout by itself if it doesn't work.<br>
If the connection failes please check if you are on HTTPS.

## Cloning on desktop

It is a git repo. If you wish to clone it on your desktop with 'IPFS get'. Use the IPFS to do this.

## Why not use Github?

This is not a GitHub app but a decentralized way of doing bits of what GitHub does. It's not a replacement.
## How can I get my files from Github?

You can clone the files on your desktop, put them in IPFS and use the IPFS hash to import them into the plugin.<br>
Be careful: the browser does not have unlimited storage, large repositories will not work!

## How can I get my files into Github?

You can get the files from IPFS and just add an origin and push.<br>





