import { env } from "process";

export class devutils {
    constructor() {}

    async log(...message:any){
        if (process.env.NODE_ENV === 'production') return;
        console.log(...message)
    }

    addSlash(file:string){
        if(!file.startsWith("/"))file="/" + file
        return file
    }
}