import React from 'react'
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Hourglass} from "lucide-react";

interface Props {
  isLoading: boolean
}

export const RequestLoading = ({isLoading}: Props) => {
  return isLoading &&
      <div className="h-full w-full flex flex-row items-center justify-center grow">
          <Alert className="w-fit mb-2 mr-2">
              <Hourglass size={16}/>
              <AlertTitle>Loading</AlertTitle>
              <AlertDescription>
                  Loading account data...
              </AlertDescription>
          </Alert>
      </div>
}