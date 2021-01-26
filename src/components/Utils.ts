import { env } from "process";

export class utils {
    constructor() {}

    async log(...message:any){
        if (process.env.NODE_ENV === 'production') return;
        Utils.log(message)
    }
}