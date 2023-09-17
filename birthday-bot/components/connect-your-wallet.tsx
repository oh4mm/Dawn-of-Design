import React from 'react'
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Unplug} from "lucide-react";

interface Props {
  connected: boolean
  isLoading: boolean
}

export const ConnectYourWallet = ({isLoading, connected}: Props) => {
  return !isLoading && !connected &&
      <div className="h-full w-full flex flex-row items-end justify-end grow">
          <Alert variant="destructive" className="w-fit mb-2 mr-2">
              <Unplug className="h-4 w-4" />
              <AlertTitle>Connect your wallet!</AlertTitle>
              <AlertDescription>
                  You need to connect your wallet before you can use this app.
              </AlertDescription>
          </Alert>
      </div>
}