import { getSimplifiedTransactionDetails, getSolBalance, type SimplifiedTransaction } from '@/api/solana-apis';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useWallet } from '@solana/wallet-adapter-react';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {

  const navigate = useNavigate();

  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number| null>(null);
  const [recentTransactions, setRecentTransactions] = useState<(SimplifiedTransaction | null)[]>();

  // redirect to home if wallet not connected
  useEffect(() => {
    if (!publicKey) {
      alert('Please connect your wallet first');
      navigate({ to: '/' });
    }
  }, [publicKey, navigate]);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        if (publicKey) {
          const fetchedBalance = await getSolBalance(publicKey.toBase58());
          setBalance(fetchedBalance);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    const fetchRecentTransactions = async () => {
      try {
        if (publicKey) {
          const transactionDetails = await getSimplifiedTransactionDetails(publicKey.toBase58(), 10);
          setRecentTransactions(transactionDetails);
          console.error(transactionDetails);
        }
      } catch (error) {
        console.error('Error fetching recent transactions: ', error);
      }
    }

    if (publicKey) {
       fetchBalance();
       fetchRecentTransactions();
    }
  }, [publicKey]);


  const handleOnSend = () => {
    navigate({to: "/sendmoney"});
  };

  return (
    <div className="container mx-auto px-4 pt-24">
      <div>
        <h1 className="text-4xl font-extrabold px-4 py-4">Dashboard</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <Card className="md:w-2/3 min-h-[12rem]">
            <CardHeader>
              <CardDescription>Total Balance</CardDescription>
              <CardTitle>
                <span className="text-6xl font-semibold tabular-nums @[250px]/card:text-3xl">{balance}</span>
                <span className="text-2xl ml-2 font-semibold @[250px]/card:text-2xl">SOL</span>
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="ml-2 text-xl font-semibold">~$1700</div>
            </CardFooter>
          </Card>
          <div className="md:w-1/3 flex flex-col justify-center items-center p-4">
            <Button variant="default" className="text-xl h-18 w-full max-w-60 rounded-4xl px-6 has-[>svg]:px-4" onClick={handleOnSend}>SEND</Button>
            {/* <Button variant="default" className="text-xl h-18 w-60 m-2 md:m-0 rounded-4xl px-6 has-[>svg]:px-4">RECEIVE</Button> */}
          </div>
        </div>
      </div>
      <div className="mt-10">
        <h1 className="text-2xl font-extrabold px-4 py-4">Recent Activity</h1>
        <Table>
          <TableCaption>A list of your recent transactions.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-2xl">Transaction</TableHead>
              <TableHead className="text-2xl">Date</TableHead>
              <TableHead className="text-2xl">Amount</TableHead>
              <TableHead className="text-2xl text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentTransactions && recentTransactions
              .filter((t): t is SimplifiedTransaction => t !== null)
              .map((recentTransaction) => (
                <TableRow key={recentTransaction.id}>
                  <TableCell className="text-2xl font-medium">{recentTransaction.id}</TableCell>
                  <TableCell className="text-2xl">{recentTransaction.timestamp}</TableCell>
                  <TableCell className="text-2xl">{recentTransaction.amount}</TableCell>
                  <TableCell className="text-2xl text-right">{recentTransaction.status}</TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
