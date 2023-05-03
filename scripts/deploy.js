// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.


/* `const hre = require("hardhat");` is importing the Hardhat Runtime Environment (HRE) module into the
script. The HRE provides a set of useful tools and utilities for developing, testing, and deploying
smart contracts on the Ethereum network. It is a popular development environment for Ethereum
developers. */
const hre = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}


async function main() {
  //SETUP ACCOUNTS
  [buyer, seller, lender, inspector] = await ethers.getSigners(); //fake accounts

  /* This code is deploying a smart contract called "RealEstate" using the Hardhat Runtime Environment
  (HRE) and the ethers.js library. */
  const RealEstate = await ethers.getContractFactory('RealEstate')
  const realEstate = await RealEstate.deploy()
  await realEstate.deployed()

  /* These lines of code are logging messages to the console. The first line is logging a message that
  includes the address of the deployed RealEstate contract. The second line is logging a message that
  indicates that 3 properties are being minted. The `\n` at the end of the second message is a newline
  character, which adds a line break after the message. */
  console.log(`Deployed Real Estate Contract at: ${realEstate.address}`)
  console.log(`Minting 3 properties...\n`)


  /* The code is using a `for` loop to mint 3 properties by calling the `mint()` function on the deployed
  `RealEstate` contract. The loop iterates 3 times, with `i` starting at 0 and incrementing by 1 each
  time. The `mint()` function takes a single argument, which is a string representing the IPFS URL of
  the property metadata. The URL is constructed using a template literal that includes the value of
  `i` in the URL path. The `connect()` method is used to connect to the `seller` account, which is
  then used to sign and send the transaction to the network. The `await` keyword is used to wait for
  the transaction to be confirmed before moving on to the next iteration of the loop. */
  for (let i = 0; i < 3; i++) {
    const transaction = await realEstate.connect(seller).mint(`https://ipfs.io/ipfs/QmQVcpsjrA6cr1iJjZAodYwmPekYgbnXGo4DFubJiLc2EB/${i + 1}.json`);
    await transaction.wait()
  }

  //DEPLOY ESCROW
  const Escrow = await ethers.getContractFactory('Escrow')
  const escrow = await Escrow.deploy(
    realEstate.address,
    seller.address,
    inspector.address,
    lender.address
  )
  await escrow.deployed()

  console.log(`Deployed Escrow Contract at: ${escrow.address}`)
  console.log(`Listing 3 properties...\n`)

  /* This code is using a `for` loop to approve 3 properties for the `Escrow` contract. The loop iterates
  3 times, with `i` starting at 0 and incrementing by 1 each time. The `approve()` function is called
  on the `RealEstate` contract, which takes two arguments: the address of the `Escrow` contract and
  the ID of the property being approved (which is `i + 1`). The `connect()` method is used to connect
  to the `seller` account, which is then used to sign and send the transaction to the network. The
  `await` keyword is used to wait for the transaction to be confirmed before moving on to the next
  iteration of the loop. This code is essentially setting up the properties to be listed for sale on
  the `Escrow` contract. */

  for (let i = 0; i < 3; i++) {
    // Approve properties...  
    let transaction = await realEstate.connect(seller).approve(escrow.address, i + 1)
    await transaction.wait()
  }
  /* This code is listing three properties for sale on the `Escrow` contract. Each property is being
  listed with a specific ID (1, 2, or 3), a buyer address, and a price in tokens. The `tokens()`
  function is being used to convert the price values from a decimal number to a token value that can
  be used in the smart contract. The `connect()` method is used to connect to the `seller` account,
  which is then used to sign and send the transaction to the network. The `await` keyword is used to
  wait for the transaction to be confirmed before moving on to the next property. This code is
  essentially setting up the properties to be sold on the `Escrow` contract. */
  //PROPERTY 1 
  transaction = await escrow.connect(seller).list(1, buyer.address, tokens(20), tokens(10))
  await transaction.wait()

  //PROPERTY 2
  transaction = await escrow.connect(seller).list(2, buyer.address, tokens(15), tokens(10))
  await transaction.wait()

  //PROPERTY 3
  transaction = await escrow.connect(seller).list(3, buyer.address, tokens(10), tokens(5))
  await transaction.wait()

  console.log("finished")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
/* This code is handling any errors that may occur during the execution of the `main()` function. If an
error occurs, it will be caught by the `catch()` method and the error message will be logged to the
console using `console.error()`. Additionally, the `process.exitCode` is set to 1, which indicates
that an error has occurred and the script should exit with a non-zero exit code. This is a common
pattern for handling errors in Node.js applications. */

main().catch((error) => {
  console.error(error)
  process.exitCode = 1;
})