import React from 'react'
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Unplug} from "lucide-react";
import {NetworkInfo} from "@aptos-labs/wallet-adapter-core";

interface Props {
  connected: boolean
  isLoading: boolean
  network: NetworkInfo | null
}

export const SwitchNetwork = ({connected, isLoading, network}: Props) => {
  return connected && !isLoading && network?.name.toString() === 'testnet' &&
      <div className="h-full w-full flex flex-row items-end justify-end grow">
          <Alert variant="destructive" className="w-fit mb-2 mr-2">
              <Unplug className="h-4 w-4" />
              <AlertTitle>Switch your network!</AlertTitle>
              <AlertDescription>
                  Switch your network to Testnet to use this app.
              </AlertDescription>
          </Alert>
      </div>
}