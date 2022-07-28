 const ethers = require("ethers");
 const fs = require("fs-extra");
 require("dotenv").config()

 async function main() {
    // HTTP://127.0.0.1:7545

    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY,provider);
            
    // const encryptedJson = fs.readFileSync("./encryptKey.js", "utf8")
    // let wallet = new ethers.Wallet.fromEncryptedJsonSync(encryptedJson, process.env.PRIVATE_KEY, provider)
    // wallet = await wallet.connect(provider);

    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
    const binary = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin",
    "utf8");

    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
    console.log("Deploying Please Wait");
     const contract = await contractFactory.deploy();
    await contract.deployTransaction.wait(1);
    console.log(`contract Address: ${contract.address}`)
    const currentFavouriteNumber = await contract.retrieve();
    console.log(currentFavouriteNumber)

    const transactionResponse = await contract.store("7")
    const transactionReceipt = await transactionResponse.wait(1);
    const updatedFavouriteNumber = await contract.retrieve();
    console.log(`updated favourite number is:  ${updatedFavouriteNumber}`) 
    
 }
 
main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error)
    process.exit(1)
})  