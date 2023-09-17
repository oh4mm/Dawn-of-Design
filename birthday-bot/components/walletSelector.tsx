"use client";

import {useWallet, WalletName} from "@aptos-labs/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import {WalletInfo} from "@aptos-labs/wallet-adapter-core";

/* 
  Component that displays a button to connect a wallet. If the wallet is connected, it displays the 
  wallet's APT balance, address and a button to disconnect the wallet. 

  When the connect button is clicked, a dialog is displayed with a list of all supported wallets. If 
  a supported wallet is installed, the user can click the connect button to connect the wallet. If
  the wallet is not installed, the user can click the install button to install the wallet.
*/
export default function WalletSelector(
  props: {
    isTxnInProgress?: boolean;
  }
) {

  // wallet state variables 
  const { connect, account, connected, disconnect, wallets, isLoading } = useWallet();
  // State to hold the current account's APT balance. In string - floating point format.
  const [balance, setBalance] = useState<string | undefined>(undefined);

  /* 
    Gets the balance of the connected account whenever the connected, account, and isTxnInProgress
    variables change.
  */
  useEffect(() => {
    if (connected && account) {
      getBalance(account.address).then()
    }
  }, [connected, account, props.isTxnInProgress]);
  
  const getBalance = async (address: string) => {
    const body = {
      function:
        "0x1::coin::balance",
      type_arguments: ["0x1::aptos_coin::AptosCoin"],
      arguments: [address],
    };
    
    let res;
    try {
      res = await fetch(
        `https://fullnode.testnet.aptoslabs.com/v1/view`,
        {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
    } catch (e) {
      setBalance("0");
      return;
    }
    
    const data = await res.json();
    setBalance((data / 100000000).toLocaleString());
  }
  
  
  const handleConnect = (walletName: WalletName) => {
    connect(walletName);
  };
  
  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <div>
      {!connected && !isLoading && (
        <Dialog>
          <DialogTrigger asChild>
            <Button>Connect Wallet</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connect your wallet</DialogTitle>
              
              {wallets.map((wallet) => {
                return wallet.readyState === "Installed" ?
                  <div
                    key={wallet.name}
                    className="flex w-fulls items-center justify-between rounded-xl p-2"
                  >
                    <h1>{wallet.name}</h1>
                    <Button variant="secondary" onClick={() => {handleConnect(wallet.name)}}>
                      Connect
                    </Button>
                  </div> :
                  <div
                    key={wallet.name}
                    className="flex w-fulls items-center justify-between rounded-xl p-2"
                  >
                    <h1>{wallet.name}</h1>
                    <a href={wallet.url} target="_blank">
                      <Button variant="secondary">
                        Install
                      </Button>
                    </a>
                  </div>
              })}
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
      
      {isLoading &&
          <Button variant="secondary" disabled>
              Loading...
          </Button>
      }
      
      {connected && account &&
          <div>
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <Button className="font-mono">
                        {balance} APT | {account.address.slice(0, 5)}...{account.address.slice(-4)}
                      </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                      <DropdownMenuItem onClick={handleDisconnect}>
                          Disconnect
                      </DropdownMenuItem>
                  </DropdownMenuContent>
              </DropdownMenu>
          </div>
      }
    </div>
  );
}