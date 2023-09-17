import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {AccountInfo} from "@aptos-labs/wallet-adapter-core";
import moment from 'moment'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function checkAccountExists(account: AccountInfo | null, setAccountExists: any) {
  if (!account)
    return
  
  const response = await fetch (
    `https://fullnode.testnet.aptoslabs.com/v1/accounts/${account.address}`,
    {
      method: 'GET'
    }
  );
  
  // Parsing the response into a json
  const accountData = await response.json();
  
  if (accountData?.error_code === 'account_not_found') {
    setAccountExists(false)
  } else {
    setAccountExists(true)
  }
}

export function truncateAddress(address: string | String | undefined): string | String {
  if (!address)
    return ''
  
  if (address.length < 6) {
    return address
  }
  
return `${address.substring(0, 6)}...${address.substring(address.length - 4, address.length)}`
}

export function formatDate(timestamp: number) {
  const date = new Date(timestamp)
  
  return {
    localeString: date.toLocaleString(),
    localeDateString: date.toLocaleDateString()
  }
}

export function humanAmount(amount: number, decimal: number) {
  const number = amount / 100000000
  
  return (Math.round(number * Math.pow(10, decimal)) / Math.pow(10, decimal)).toFixed(decimal)
}