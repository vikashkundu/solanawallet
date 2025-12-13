import { Connection, PublicKey,  LAMPORTS_PER_SOL, type TransactionSignature, Transaction, SystemProgram, type ParsedTransactionWithMeta, type ConfirmedSignatureInfo, type SignaturesForAddressOptions, SystemInstruction, type ParsedInstruction} from "@solana/web3.js";

const RPC_URL = 'https://solana-devnet.g.alchemy.com/v2/Z5rkVTBL528nGl4kzLL8E'; //'https://api.devnet.solana.com';
const connection = new Connection(RPC_URL, 'confirmed');

function toPublicKey(address: string): PublicKey {
    try {
        return new PublicKey(address);
    } catch (error) {
        console.error('Invalid address format', address);
        throw new Error('Invalid Solana public key.');
    }
}

export async function getSolBalance(address: string): Promise<number | null> {
    const publicKey = toPublicKey(address);
    try {
        const lamports = await connection.getBalance(publicKey, 'confirmed');
        const solBalance = lamports / LAMPORTS_PER_SOL;
        return solBalance;
    } catch (error) {
        return null;
    }
}

export async function sendSolana(
    senderPublicKey: PublicKey,
    recipientAddress: string,
    amountInSol: number,
    signTransaction: (transaction: Transaction) => Promise<Transaction>,
): Promise<TransactionSignature> {
    const recipientPublicKey = toPublicKey(recipientAddress);
    const lamportsToSend = amountInSol * LAMPORTS_PER_SOL;
    if (lamportsToSend <= 0) {
        throw new Error('Amount must be greater than zero');
    }

    //creating transfer instructions
    const transferInstructions = SystemProgram.transfer({
        fromPubkey: senderPublicKey,
        toPubkey: recipientPublicKey,
        lamports: lamportsToSend,
    });

    //creating the transaction
    const transaction = new Transaction().add(transferInstructions);

    //set the fee payer and get the latest blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = senderPublicKey;

    //sign txn (this requires to the user's wallet to be connected)
    const signedTxn = await signTransaction(transaction);

    //send the raw signed txn to the cluster
    const signature = await connection.sendRawTransaction(signedTxn.serialize());

    //confirming the txn
    await connection.confirmTransaction({
        blockhash: blockhash,
        lastValidBlockHeight: (await connection.getLatestBlockhash()).lastValidBlockHeight,
        signature: signature
    }, 'confirmed');

    return signature;
}

export interface SimplifiedTransaction {
    id: string; //first 4 and last 4 digits
    timestamp: string; //date and time in a readable format
    amount: string; // amount with + or - sign, eg -1.5 SOL or "+2.0 SOL"
    status: 'Confirmed' | 'Failed'; //cofirmation status
}

export async function getSimplifiedTransactionDetails(
    address: string,
    limit: number,
): Promise<(SimplifiedTransaction | null)[]> {
    const parsedTransactionsWithMeta: (ParsedTransactionWithMeta | null) [] = await getRecentTransactions(address, limit);
    const simplifiedTransaction: (SimplifiedTransaction | null)[] = [];
    for (const parsedTransaction of parsedTransactionsWithMeta) {
        if (parsedTransaction) {
            simplifiedTransaction.push(simplifyTransactionDetails(parsedTransaction, address));
        }
    }
    return simplifiedTransaction;
}

export function simplifyTransactionDetails(
    tx: ParsedTransactionWithMeta,
    walletAddress: string,
): SimplifiedTransaction | null {

    //getting signature and status

    const signature = tx.transaction.signatures[0];
    const txId = `${signature.slice(0, 4)}...${signature.slice(-4)}`;
    const status: 'Confirmed' | 'Failed' = tx.meta?.err ? 'Failed' : 'Confirmed';

    //getting timestamp
    const blockTime = tx.blockTime; //time stamp in epoch
    let timestamp = 'N/A';
    if (blockTime) {
        timestamp = new Date(blockTime * 1000).toLocaleString();
    }

    let amountSol = 0;
    let direction: 'sent' | 'received' | 'none' = 'none';

    const instructions = tx.transaction.message.instructions;

    for (const instruction of instructions) {
        const parsedInstruction = instruction as ParsedInstruction;
        if (parsedInstruction.program === 'system'  && parsedInstruction.parsed?.type === 'transfer') {
            const info = parsedInstruction.parsed?.info as {source: string; destination: string; lamports: number};
            const lamports = info.lamports;
            if (lamports > 0) {
                if (info.source === walletAddress) {
                    amountSol = -(lamports / LAMPORTS_PER_SOL);
                    direction = 'sent';
                    break;
                } else if (info.destination === walletAddress) {
                    amountSol = lamports / LAMPORTS_PER_SOL;
                    direction = 'received';
                    break;
                }
            }
        }
    }

    if (direction === 'none') {
        return null;
    }

    const sign = amountSol >= 0 ? '+' : '';
    const formattedAmount = `${sign}${amountSol.toFixed(4)}`;

    return {
        id: txId,
        timestamp: timestamp,
        amount: formattedAmount,
        status: status,
    }
}

export async function getRecentTransactions(
    address: string,
    limit: number,
): Promise<(ParsedTransactionWithMeta | null)[]> {

    //fetch list of txn signatures
    const signatures = await fetchSignatures(address, limit);
    const signatureStrings = signatures.map(sig => sig.signature);

    //fetch detailed, parsed txns
    const transactionDetails = await fetchTransactionDetails(signatureStrings);

    return transactionDetails;
}

async function fetchSignatures(
    address: string,
    limit: number = 10,
): Promise<ConfirmedSignatureInfo[]> {
    const pubKey = toPublicKey(address);
    let allSignatures: ConfirmedSignatureInfo[] = [];
    let options: SignaturesForAddressOptions = {
        limit: Math.min(limit, 1000),
    }

    //will fetch the all txns in chunks
    while (allSignatures.length < limit) {
        try {
            if (allSignatures.length > 0) {
                options.before = allSignatures[allSignatures.length - 1].signature;
            }

            const signatures = await connection.getSignaturesForAddress(
                pubKey,
                options,
                'confirmed'
            );

            if (signatures.length === 0) {
                break;
            }

            allSignatures = allSignatures.concat(signatures);

            if (allSignatures.length >= limit) {
                break;
            }
        } catch (error) {
            console.error('Error fetching signatures: ', error);
            break;
        }
    }

    return allSignatures.slice(0, limit);
}

async function fetchTransactionDetails(
    signatures: string[]
): Promise<(ParsedTransactionWithMeta | null)[]> {
    if (signatures.length === 0) {
        return [];
    }

    try {
        const transactionDetails = await connection.getParsedTransactions(
            signatures,
            {
                maxSupportedTransactionVersion: 0,
                commitment: 'confirmed',
            }
        );

        return transactionDetails;
    } catch (error) {
        console.error('Error fetching transaction details: ', error);
    }

    return [];
}