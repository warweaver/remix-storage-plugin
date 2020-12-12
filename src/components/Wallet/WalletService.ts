import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import { getAddress } from "@ethersproject/address";
import Web3 from "web3";
import { BehaviorSubject } from "rxjs";
export class WalletService {
  // WEB3 modal functions
  web3Modal: Web3Modal = new Web3Modal();
  addressBehavior = new BehaviorSubject<string>("");
  provider: any = "";
  status = new BehaviorSubject<boolean>(false);
  address: string = "";

  async openModal() {
    //if (!this.web3Modal) {
    this.web3Modal = new Web3Modal({
      providerOptions: this.getProviderOptions(), // required
    });
    this.web3Modal.on('connect', async (provider) => {
        this.provider = provider
//        const web3 = new Web3(this.provider);
//        console.log(web3, this.provider);
        const [address] = await this.provider.enable();
        this.address = getAddress(address);
        this.addressBehavior.next(getAddress(address));
        this.status.next(true);
    })
    await this.web3Modal.connect();

  }

  getProviderOptions() {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: "83d4d660ce3546299cbe048ed95b6fad",
        },
      },
    };
    return providerOptions;
  }
}
