import React from 'react'
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Unplug} from "lucide-react";

interface Props {
  connected: boolean
  isLoading: boolean
  accountExists: Boolean
}

export const AccountNotFound = ({connected, isLoading, accountExists}: Props) => {
  return connected && !isLoading && !accountExists &&
      <div className="h-full w-full flex flex-row items-end justify-end grow">
          <Alert variant="destructive" className="w-fit mb-2 mr-2">
              <Unplug className="h-4 w-4" />
              <AlertTitle>Account not found!</AlertTitle>
              <AlertDescription>
                  Please make sure your account is exists on Testnet and try again.
              </AlertDescription>
          </Alert>
      </div>

}