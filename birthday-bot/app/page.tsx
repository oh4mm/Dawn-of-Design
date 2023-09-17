"use client";

import {useWallet} from "@aptos-labs/wallet-adapter-react";
import WalletSelector from "../components/walletSelector";
import {Separator} from "@/components/ui/separator";
import ThemeToggle from "@/components/ThemeToggle";
import TypographyH2 from "@/components/TypographyH2";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {History} from 'lucide-react';
import TypographyH1 from "@/components/TypographyH1";
import {TypographyP} from "@/components/TypographyP";
import GiftCreator from "./GiftCreator";
import GiftList from "./GiftList";
import {checkAccountExists} from "@/lib/utils";
import {SwitchNetwork} from "@/components/switch-network";
import {AccountNotFound} from "@/components/account-not-found";
import {ConnectYourWallet} from "@/components/connect-your-wallet";
import {RequestLoading} from "@/components/request-loading";

/* 
  The home page of the app. Displays a message and holds the GiftCreator and GiftList components.
*/
export default function Home() {
  // wallet state variables
  const {connected, isLoading, network, account} = useWallet();
  // State to indicate if a transaction is in progress. Used to disable and refresh components.
  const [txnInProgress, setTxnInProgress] = useState(false);
  // State to indicate if the connected account exists on Testnet. Used to display an error message.
  const [accountExists, setAccountExists] = useState<Boolean>(true);
  
  /*
    Checks if the connected account exists whenever the connected and account variables change.
  */
  useEffect(() => {
    checkIfAccountExists().then()
  }, [connected, account])
  
  /* 
    Checks if the connected account exists. If the account does not exist, sets the accountExists
    state to false. If the account exists, sets the accountExists state to true.
  */
  const checkIfAccountExists = async () => {
    await checkAccountExists(account, setAccountExists)
  }
  
  return (
    <div className="min-h-screen h-full w-full max-w-screen flex flex-col items-center dark:bg-slate-950">
      <div className="flex w-full max-w-screen-2xl lg:flex-row flex-col justify-between items-center my-2 px-40">
        <TypographyH2>Birthday Bot</TypographyH2>
        <div className="flex flex-row justify-around gap-2">
          <ThemeToggle/>
          <a href="/history">
            <Button variant="outline">
              History
              <History className="ml-2" size={16}/>
            </Button>
          </a>
          <WalletSelector isTxnInProgress={txnInProgress}/>
        </div>
      </div>
      <Separator/>
      <div className="my-6">
        <div className="flex flex-col items-center">
          <TypographyH1>The Birthday Bot</TypographyH1>
          <TypographyP classname="w-10/12 break-normal">
            An automated and on-chain gift giving platform. Use this platform to create gifts that hold
            APT tokens that can be opened by the recipient on their birthday.
            <br/>
            <br/>
            This dapp is built from Overmind's <a href="https://overmind.xyz/quests/dawn-of-design"
                                                  target="_blank"><span className="underline decoration-slate-200">birthday bot frontend  quest</span></a> and
            is based off Overmind's <a href="https://overmind.xyz/quests/birthday-bot" target="_blank"><span
            className="underline decoration-slate-200">birthday bot quest</span></a>.
          </TypographyP>
        </div>
      </div>
      
      {
        connected && network?.name.toString() == "Testnet" && accountExists &&
        (
          <div className="h-full w-full flex lg:flex-row flex-col items-center justify-center gap-20 my-4 grow">
            <GiftCreator setTxn={setTxnInProgress} isTxnInProgress={txnInProgress}/>
            <GiftList setTxn={setTxnInProgress} isTxnInProgress={txnInProgress}/>
          </div>
        )
      }
      
      <RequestLoading isLoading={isLoading}/>
      <ConnectYourWallet connected={connected} isLoading={isLoading}/>
      <SwitchNetwork connected={connected} isLoading={isLoading} network={network}/>
      <AccountNotFound connected={connected} isLoading={isLoading} accountExists={accountExists}/>
    </div>
  );
}