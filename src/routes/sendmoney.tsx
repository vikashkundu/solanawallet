import { sendSolana } from '@/api/solana-apis';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWallet } from '@solana/wallet-adapter-react';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react';

export const Route = createFileRoute('/sendmoney')({
  component: SendMoney,
})

function SendMoney() {

  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [solAmount, setSolAmount] = useState<number>(0.0);
  const { publicKey, signTransaction } = useWallet();

  const navigate = useNavigate();

  useEffect(() => {
    if (!publicKey) {
      alert('Please connect your wallet first');
      navigate({ to: '/' });
    }
  }, [publicKey, navigate]);

  const handleSendSolana = async () => {
    if (!publicKey || !signTransaction) {
      alert('Wallet is not connected');
      return;
    }
    try {
      const signature = await sendSolana(publicKey, recipientAddress, solAmount, signTransaction);
      alert(`Transaction is successful: ${signature}`);
    } catch (error) {
      console.error('Transaction failed:', error);
      alert('Transaction failed!');
    }
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-20 px-4">
      <div className="flex flex-col items-center gap-8 w-full">
        <h1 className="text-4xl font-extrabold font-mono text-center">
          SEND-CRYPTO
        </h1>
        <Card className="w-full max-w-sm">
          <CardHeader className="text-3xl">
            <CardTitle>Send sol</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className='grid gap-2'>
                <Label htmlFor="recepientAddress" className="text-xl">Recipient</Label>
                <Input id="recepientAddress"
                  type="text"
                  placeholder="Enter wallet address"
                  required
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <div className='grid gap-2'>
                  <Label htmlFor="token" className="text-xl">Token</Label>
                  <Input id="token"
                    type="text"
                    value="Solana (SOL)"
                    readOnly
                  />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor="amount" className="text-xl">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    min={0}
                    value={solAmount}
                    onChange={(e) => {
                      const val = Math.max(0, Number(e.target.value));
                      setSolAmount(val);
                    }}
                  />
                </div>
              </div>
              <div className='grid gap-2'>
                <Label htmlFor="txnFees" className="text-xl">Transaction Fees</Label>
                <Input id="txnFees"
                  type="text"
                  value="0.0000005 SOL (<$0.01)"
                  readOnly
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" onClick={handleSendSolana}>
              Send
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
