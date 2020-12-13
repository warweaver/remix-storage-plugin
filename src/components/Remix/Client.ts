import { PluginClient } from '@remixproject/plugin'
import { createClient } from '@remixproject/plugin-webview'
import { toast } from 'react-toastify'
import { BehaviorSubject } from 'rxjs'
import { gitservice } from '../../App'
import { fileservice } from '../../App'


export class WorkSpacePlugin extends PluginClient {
    clientLoaded = new BehaviorSubject(false)
    callBackEnabled:boolean = true

    constructor() {
        super()
        createClient(this)
        toast.info("Connecting to REMIX")
        this.onload().then(async () => {
            console.log('workspace client loaded', this)
            toast.success("Connected to REMIX")
            this.clientLoaded.next(true)
            await this.enableCallBacks()
        })
    }

    async enableCallBacks() {
        this.on('solidity','compilationFinished', async(file, source,version,result) =>{
            console.log("compilationFinished")
            console.log(result.contracts);
            const r = await this.call('solidity','getCompilationResult')
            console.log("getCompilationResult")
            console.log(r.contracts)

        })

        this.on('fileManager', 'fileSaved', async (e) => {
          // Do something
          console.log(e)
          fileservice.addFileFromBrowser(e)
       
          //await this.addFileFromBrowser(e)
        })
    
        this.on('fileManager', 'fileAdded', async (e) => {
          // Do something
          fileservice.addFileFromBrowser(e)
          console.log(e)
        })
    
        this.on('fileManager', 'fileRemoved', async (e) => {
          // Do something
          console.log(e)
          await fileservice.rmFile(e)
         // await this.rmFile(e)
    
        })
    
        this.on('fileManager', 'currentFileChanged', async (e) => {
          // Do something
          console.log(e)
          //await this.rmFile(e)
        })
    
        this.on('fileManager', 'fileRenamed', async (oldfile,newfile) => {
          // Do something
          console.log(oldfile,newfile)
          fileservice.rmFile(oldfile)
          fileservice.addFileFromBrowser(newfile)
          //await this.addFileFromBrowser(e)
        })
        this.callBackEnabled = true
      }
    
      async disableCallBacks() {
        this.callBackEnabled = false
      }
}

