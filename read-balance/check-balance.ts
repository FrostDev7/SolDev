import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { getDomainKey, NameRegistryState } from "@bonfida/spl-name-service";

// Function to resolve Solana domain to public key
async function getPublicKeyFromSolDomain(domain: string, connection: Connection):Promise<string>{
    const { pubkey } = await getDomainKey(domain);
    const owner = (await NameRegistryState.retrieve(connection, pubkey)).registry.owner.toBase58();
    console.log(`The owner of SNS Domain: ${domain} is: `,owner);
    return owner;
}

const suppliedIdentifier = process.argv[2];
if (!suppliedIdentifier) {
  throw new Error("Provide a public key or domain name to check the balance of!");
}

const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");

let publicKey: PublicKey;
try {
  // Check if suppliedIdentifier is a valid public key
  publicKey = new PublicKey(suppliedIdentifier);
} catch (error) {
  // If not, assume it is a domain and attempt to resolve it
  try {
    publicKey = new PublicKey(await getPublicKeyFromSolDomain(suppliedIdentifier, connection));
  } catch (domainError) {
    throw new Error("Invalid public key or domain name provided. Please provide a valid Solana public key or domain name.");
  }
}

// Use top-level await to get the balance of the public key in lamports
let balanceInLamports: number;
try {
  balanceInLamports = await connection.getBalance(publicKey);
} catch (error) {
  console.error("Failed to fetch balance:", error);
  process.exit(1); // Exit the process with an error code
}

// Convert the balance from lamports to SOL
const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;

// Log the balance in SOL
console.log(
  `✅ Finished! The balance for the wallet at address ${publicKey.toString()} is ${balanceInSOL} SOL!`
);
