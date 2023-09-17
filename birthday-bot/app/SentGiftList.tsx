import React, { useEffect } from "react";
import { X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import {formatDate, humanAmount, sleep, truncateAddress} from "@/lib/utils";
import {Types} from "aptos";

type Gift = {
  address: String;
  amount: number;
  timestamp: number;
};

/*
  List of gifts that the user has sent to others.
*/
export default function SentGiftList(
  props: {
    isTxnInProgress: boolean;
    setTxn: (isTxnInProgress: boolean) => void;
  }
) {
  // Wallet adapter state
  const { account, connected, signAndSubmitTransaction } = useWallet();
  // Gift list state
  const [gifts, setGifts] = React.useState<Gift[]>([]);

  /* 
    Retrieves the gifts sent by the user whenever the account, connected, or isTxnInProgress state 
    changes.
  */
  useEffect(() => {
    if (connected) {
      getGifts().then((gifts) => {
        if (gifts) {
          setGifts(gifts);
        }
      });
    }
  }, [account, connected, props.isTxnInProgress]);

  /* 
    Retrieves the gifts sent by the user.
  */  
  const getGifts = async () => {
    if (!account) return
    
    const body = {
      function: `${process.env.MODULE_ADDRESS}::${process.env.MODULE_NAME}::view_gifters_gifts`, // The address::module::function to call
      type_arguments: [],
      arguments: [account.address],
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
      return;
    }
    
    const data = await res.json();
    
    let gifts: Gift[] = []
    
    if (data.length) {
      const [addressArr, amountArr, dateArr] = data
      
      addressArr.forEach((address: string, index: number) => {
        gifts.push({
          address,
          amount: parseInt(amountArr[index]),
          timestamp: parseInt(dateArr[index]),
        })
      })
    }
    
    return gifts;
  };

  /*
    Cancels a gift sent by the user.
  */
  const cancelGift = async (recipientAddress: String) => {
    props.setTxn(true)
    
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload", // The type of transaction payload
      function: `${process.env.MODULE_ADDRESS}::${process.env.MODULE_NAME}::remove_birthday_gift`, // The address::module::function to call
      type_arguments: [],
      arguments: [
        recipientAddress
      ],
    };
    
    try {
      const result = await signAndSubmitTransaction(payload);
      await sleep(parseInt(process.env.TRANSACTION_DELAY_MILLISECONDS || '0'))
      console.log(result);
    } catch (e) {
      props.setTxn(false)
      return
    }
    
    props.setTxn(false)
  };

  return (
    <div className="flex flex-col gap-2">
      <div>
        <CardTitle className="my-2">Gifts sent from you</CardTitle>
        <CardDescription className="break-normal w-96">
          View all of the unclaimed gifts you have sent to others. You can cancel any of these gifts
          at any time and the APT will be returned to your wallet.
        </CardDescription>
      </div>
      <ScrollArea className="border rounded-lg">
        <div className="h-fit max-h-56">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Recipient</TableHead>
                <TableHead className="text-center">Birthday</TableHead>
                <TableHead className="text-center">Amount</TableHead>
                <TableHead className="text-center">Cancel gift</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gifts.length === 0 &&
                  <TableRow>
                      <TableCell colSpan={4}>
                          <p className="break-normal w-80 text-center">
                              You don't have any active gifts. Send a gift to someone to get started!
                          </p>
                      </TableCell>
                  </TableRow>
              }
              
              {gifts.length > 0 &&
                  gifts.map((gift, index: number) => {
                    const date = formatDate(gift.timestamp)
                    
                    return (
                      <TableRow key={index}>
                        <TableCell className="font-mono">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger className="underline">
                                {truncateAddress(gift.address)}
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {gift.address}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell className="text-center">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger className="underline">
                                {date.localeDateString}
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {date.localeString}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell className="font-mono text-right">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger className="underline">
                                {humanAmount(gift.amount, 2)} APT
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {humanAmount(gift.amount, 8)} APT
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell className="text-center">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive">
                                <X className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will cancel the gift for{" "}
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger className="underline">
                                        {truncateAddress(account?.address)}
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>
                                          {account?.address}
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider> and return the{" "}
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger className="underline">
                                        {humanAmount(gift.amount, 2)}
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>
                                          {humanAmount(gift.amount, 8)}
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider> APT to your wallet.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Nevermind</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => {cancelGift(gift.address).then()}}
                                >
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    )
                  })
              }
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
}