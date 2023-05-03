//This code is about testing the smart contract👇

/* `const { expect } = require('chai');` is importing the `expect` function from the `chai` library.
The `expect` function is used for making assertions in tests, allowing the developer to check that
certain conditions are true. By importing `expect` in this way, the developer can use it directly in
their test code without having to reference the `chai` library explicitly. */
const { expect } = require('chai');
/* `const { ethers } = require('hardhat');` is importing the `ethers` library from the `hardhat`
package. The `ethers` library provides a set of tools for interacting with Ethereum smart contracts,
including functions for deploying contracts, sending transactions, and reading contract state */
const { ethers } = require('hardhat');

/**
 * The function converts a number into its equivalent token value in ether.
 * @param n - The parameter `n` is a number that represents the amount of ether to be converted into
 * its equivalent token value.
 * @returns The function `tokens` takes a number `n` as input and returns the equivalent value in wei
 * (the smallest unit of ether). It uses the `ethers.utils.parseUnits` method to convert the number to
 * wei and returns the result.
 */
const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

// TESTING ESCROW
//parameters are also variables
describe('Escrow', () => {
    /* The above code is declaring four variables named inspector, buyer, seller, and lender, and two
    variables named escrow and realEstate. The code is not assigning any values to these variables or
    performing any operations with them. */
    let inspector, buyer, seller, lender;
    let escrow, realEstate;

    beforeEach(async () => {
        /* This code is testing the deployment and functionality of an escrow smart contract for a real
        estate transaction. It sets up fake accounts for the buyer, seller, lender, and inspector,
        deploys a RealEstate contract, mints a new NFT (non-fungible token) for the property, deploys
        an Escrow contract, approves the transfer of the NFT to the Escrow contract, and lists the
        property for sale on the Escrow contract. The `it('saves the address', async () => {...})`
        function is a test case that checks that the addresses of the RealEstate contract, seller,
        inspector, and lender are saved correctly in the Escrow contract. The `describe('DEPLOYMENT',
        () => {...})` function contains several test cases that check that the Escrow contract was
        deployed correctly and that its state variables were initialized correctly. The
        `describe('Listing', async () => {...})` function contains several test cases that check that
        the property was listed correctly on the Escrow contract and that its details were saved
        correctly. */

        //SETUP ACCOUTS
        /* `[buyer, seller, lender, inspector] = await ethers.getSigners()` is creating four new Ethereum
        accounts (buyers, sellers, lenders, and inspectors) using the `ethers.getSigners()` method. The
        `await` keyword is used to wait for the accounts to be created before proceeding. The resulting
        array of accounts is then destructured into four separate variables: `buyer`, `seller`, `lender`,
        and `inspector`. These variables can be used to interact with the Ethereum blockchain and smart
        contracts. */

        [buyer, seller, lender, inspector] = await ethers.getSigners(); //fake accounts

        //Deploy Real estate
        /* This code is creating a contract factory for the `RealEstate` smart contract using the
        `ethers.getContractFactory()` method and then deploying a new instance of the
        `RealEstate` contract using the `deploy()` method on the resulting `RealEstate` object.
        The resulting `realEstate` object is a new instance of the `RealEstate` contract that
        can be used to interact with the contract's functions and state variables. */
        const RealEstate = await ethers.getContractFactory("RealEstate")
        realEstate = await RealEstate.deploy()


        //Mint
        /* This code is minting a new NFT (non-fungible token) by calling the `mint` function of the
        `RealEstate` contract and passing in a URL for an image file. The `connect` method is
        used to specify the account that is calling the function, in this case the `seller`
        account. The `await` keyword is used to wait for the transaction to be confirmed on the
        blockchain before proceeding. The resulting transaction object is stored in the
        `transaction` variable, and the `wait` method is called on it to wait for confirmation. */
        let transaction = await realEstate.connect(seller).mint("https://ipfs.io/ipfs/QmQUozrHLAusXDxrvsESJ3PYB3rUeUuBAvVWw6nop2uu7c/1.png",)
        await transaction.wait()

        //Deploy escrow
        /* `const Escrow = await ethers.getContractFactory('Escrow');` is creating a contract factory
        for the `Escrow` smart contract. The `ethers.getContractFactory()` method is used to
        create a factory that can be used to deploy new instances of the contract. The argument
        `'Escrow'` specifies the name of the contract to be deployed. The resulting `Escrow`
        object can be used to deploy new instances of the `Escrow` contract. */
        const Escrow = await ethers.getContractFactory('Escrow');
        /* This code is deploying a new instance of the `Escrow` smart contract by calling the `deploy` method
        on the `Escrow` contract factory. The `deploy` method takes four arguments: the address of the
        `RealEstate` contract, the address of the seller, the address of the inspector, and the address of
        the lender. These arguments are used to initialize the state variables of the `Escrow` contract. The
        resulting `escrow` object is a new instance of the `Escrow` contract that can be used to interact
        with the contract's functions and state variables. */

        escrow = await Escrow.deploy(
            /* The above code is accessing the `address` property of four different objects:
            `realEstate`, `seller`, `inspector`, and `lender`. */
            realEstate.address,
            seller.address,
            inspector.address,
            lender.address
        )

        //APPROVE PROPERTY
        /* This code is approving the transfer of a specific NFT (non-fungible token) from the
        `seller` account to the `escrow` contract. The `approve` function is called on the
        `realEstate` contract, with the `escrow` contract address and the ID of the NFT as
        arguments. This allows the `escrow` contract to take ownership of the NFT and hold it in
        escrow until the conditions of the sale are met. The `wait()` function is called on the
        resulting transaction object to wait for the transaction to be confirmed on the blockchain
        before proceeding. */
        transaction = await realEstate.connect(seller).approve(escrow.address, 1)
        await transaction.wait()

        //LIST PROPERTY
        /* This code is listing a property for sale on the `escrow` contract. The `list` function is called on
        the `escrow` contract, with four arguments: the ID of the NFT being sold, the address of the buyer,
        the purchase price in ether (converted to wei using the `tokens` function), and the amount of ether
        to be held in escrow (also converted to wei using the `tokens` function). The resulting transaction
        object is stored in the `transaction` variable, and the `wait()` function is called on it to wait
        for the transaction to be confirmed on the blockchain before proceeding. */
        transaction = await escrow.connect(seller).list(1, buyer.address, tokens(10), tokens(5))
        await transaction.wait()
    })

    /* This code is defining a test suite using the `describe` function to test the deployment of an
    escrow smart contract for a real estate transaction. Within the `describe` function, there is
    another `describe` function called `'DEPLOYMENT'` that contains several test cases (using the
    `it` function) to check that the Escrow contract was deployed correctly and that its state
    variables were initialized correctly. Each test case checks a specific aspect of the
    contract's deployment, such as checking that the NFT address, seller address, inspector
    address, and lender address were saved correctly in the Escrow contract. The `expect` function
    is used to make assertions about the values returned by the contract's functions, and the
    `async` and `await` keywords are used to handle asynchronous operations. */

    //DEVELOPMENT
    describe('Deployment', () => {
        //NFT ADDRESS
        /* This code is defining a test case using the `it` function to check that the `nftAddress`
        function of the `Escrow` contract returns the correct address of the `RealEstate`
        contract. The `async` and `await` keywords are used to handle asynchronous operations.
        The `result` variable is assigned the value returned by the `nftAddress` function when it
        is called on the `escrow` object. The `expect` function is used to make an assertion that
        the `result` variable is equal to the address of the `realEstate` object. If the
        assertion is true, the test case passes. */
        it('Returns NFT address', async () => {
            const result = await escrow.nftAddress()
            expect(result).to.be.equal(realEstate.address)
        })

        //SELLER IT FUNCTION
        /* This code is defining a test case using the `it` function to check that the `seller` function of the
        `Escrow` contract returns the correct address of the seller account. The `async` and `await`
        keywords are used to handle asynchronous operations. The `result` variable is assigned the value
        returned by the `seller` function when it is called on the `escrow` object. The `expect` function is
        used to make an assertion that the `result` variable is equal to the address of the `seller`
        account. If the assertion is true, the test case passes. */
        it('Returns seller', async () => {
            const result = await escrow.seller()
            expect(result).to.be.equal(seller.address)
        })

        //INSPECTOR IT FUNCTION
        it('Returns inspector', async () => {
            const result = await escrow.inspector()
            expect(result).to.be.equal(inspector.address)
        })

        //LENDER IT FUNCTION
        it('Returns lender', async () => {
            const result = await escrow.lender()
            expect(result).to.be.equal(lender.address)
        })
    })

    /* The above code is a test suite written in JavaScript using the Mocha testing framework. It is
    testing various functions related to a real estate escrow contract, such as checking if a
    listing is listed, returning the buyer and purchase price, and updating ownership. The
    `expect` statements are making assertions about the results of these functions. */

    //LISTING
    describe('Listing', async () => {
        /* The above code is a test case written in JavaScript using the Mocha testing framework. It
        is testing whether the function `isListed()` of an `escrow` object returns `true` when
        passed the argument `1`. The test is using the `expect` assertion from the Chai assertion
        library to check if the result is equal to `true`. */
        it('Update as listed', async () => {
            const result = await escrow.isListed(1)
            expect(result).to.be.equal(true)
        })

        /* The above code is a test case written in JavaScript using the Mocha testing framework and
        Chai assertion library. It is testing the `buyer` function of an `escrow` contract by
        passing in an ID of 1 and expecting the result to be equal to the address of a `buyer`
        variable. */
        it('Returns buyer', async () => {
            const result = await escrow.buyer(1)
            expect(result).to.be.equal(buyer.address)
        })

        /* The above code is a test case written in JavaScript using the testing framework Mocha and
        the assertion library Chai. It tests the function `purchasePrice()` of an object `escrow`
        by passing an argument `1` and expecting the returned value to be equal to the 10th
        element of an array `tokens`. The purpose of this test case is to ensure that the
        `purchasePrice()` function returns the correct value. */
        it('Returns purchase price', async () => {
            const result = await escrow.purchasePrice(1)
            expect(result).to.be.equal(tokens(10))
        })

        /* The above code is a test case written in JavaScript using the testing framework Mocha and
        the assertion library Chai. It tests the function `escrowAmount()` of an `escrow` object.
        The function takes an argument of `1` and is expected to return a value equal to
        `tokens(5)`. The `expect()` function from Chai is used to assert that the actual result
        of the function matches the expected result. */
        it('Returns escrow amount', async () => {
            const result = await escrow.escrowAmount(1)
            expect(result).to.be.equal(tokens(5))
        })

        /* The above code is a test case written in JavaScript using the testing framework Mocha. It
        is testing whether the ownership of a real estate asset with ID 1 has been updated to the
        address of an escrow contract. The `expect` statement is checking if the result of the
        function call `realEstate.ownerOf(1)` is equal to the address of the `escrow` contract.
        If the test passes, it means that the ownership has been successfully updated to the
        escrow contract. */
        it('Updates ownership', async () => {
            // expect(await realEstate.ownerOf(1).to.be.equal(escrow.address))
            expect(await realEstate.ownerOf(1)).to.be.equal(escrow.address)
        })
    })

    //DEPOSITS
    describe('Deposits', () => {
        beforeEach(async () => {
            const transaction = await escrow.connect(buyer).depositEarnest(1, { value: tokens(5) })
            await transaction.wait()
        })

        it('Updates contract balance', async () => {
            const result = await escrow.getBalance();
            expect(result).to.be.equal(tokens(5))
        })
    })

    //INSPECTION
    describe('Inspection', () => {
        beforeEach(async () => {
            const transaction = await escrow.connect(inspector).updateInspectionStatus(1, true);
            await transaction.wait()
        })

        it("Updates the inspection status", async () => {
            const result = await escrow.inspectionPassed(1)
            expect(result).to.be.equal(true)
        })
    })


    // //APPROVAL
    describe('Approval', () => {
        beforeEach(async () => {
            let transaction = await escrow.connect(buyer).approvedSale(1)
            await transaction.wait()

            transaction = await escrow.connect(seller).approvedSale(1)
            await transaction.wait()

            transaction = await escrow.connect(lender).approvedSale(1)
            await transaction.wait()
        })

        it('Updates approval status', async () => {
            expect(await escrow.approval(1, buyer.address)).to.be.equal(true)
            expect(await escrow.approval(1, seller.address)).to.be.equal(true)
            expect(await escrow.approval(1, lender.address)).to.be.equal(true)
        })
    })



    //SALE
    describe('Sale', () => {
        beforeEach(async () => {
            /* The above code is using the JavaScript programming language and it is calling the
            `depositEarnest` function of an `escrow` contract instance, using the `buyer`
            account to make a deposit of 5 tokens as earnest money for a transaction with an ID
            of 1. The `await` keyword is used to wait for the transaction to be confirmed on
            the blockchain before proceeding. */
            let transaction = await escrow.connect(buyer).depositEarnest(1, { value: tokens(5) })
            await transaction.wait()

            /* The above code is using JavaScript to update the inspection status of an escrow
            contract. It is calling the `updateInspectionStatus` function on the `escrow`
            object, passing in two arguments: `1` and `true`. The first argument is the ID of
            the inspection being updated, and the second argument is a boolean value
            indicating whether the inspection has passed or failed. The `await` keyword is
            used to wait for the transaction to be confirmed on the blockchain before
            proceeding. */
            transaction = await escrow.connect(inspector).updateInspectionStatus(1, true)
            await transaction.wait()

            /* The above code is using the `await` keyword to call the `approvedSale()` function on
            the `escrow` contract instance, with the `buyer` account as the caller and passing
            `1` as the argument. It then waits for the transaction to be confirmed on the
            blockchain using the `wait()` method. This code is likely part of a larger smart
            contract that is facilitating an escrow transaction between a buyer and a seller. */
            transaction = await escrow.connect(buyer).approvedSale(1)
            await transaction.wait()
            // console.log(approvedSale())
            /* The above code is using the `await` keyword to call the `approvedSale` function
            on the `escrow` contract instance, with the `seller` account as the caller and
            passing in the argument `1`. It then waits for the transaction to be confirmed
            on the blockchain using the `wait()` method. This code is likely part of a
            larger smart contract that is facilitating a sale between a buyer and a seller,
            with the `approvedSale` function being used to approve the sale and release the
            funds held in escrow. */
            transaction = await escrow.connect(seller).approvedSale(1)
            await transaction.wait()


            /* The above code is using JavaScript syntax to call a function called `approvedSale`
            on an object called `escrow`. The function is being called with an argument of
            `1`. The `await` keyword is used to wait for the function to complete before
            moving on to the next line of code. Once the function is complete, the `wait()`
            method is called on the returned transaction object to wait for the transaction to
            be confirmed on the blockchain. This code is likely part of a larger smart
            contract or decentralized application that involves the use of an escrow service
            and a lender. */
            transaction = await escrow.connect(lender).approvedSale(1)
            await transaction.wait()

            /* The above code is sending a transaction from the `lender` account to the `escrow`
            contract address with a value of 5 tokens. The `tokens()` function is likely a
            utility function that converts a token amount to its equivalent in wei (the
            smallest unit of ether). The `await` keyword indicates that the transaction is
            asynchronous and the code will wait for the transaction to be confirmed before
            proceeding. */
            await lender.sendTransaction({ to: escrow.address, value: tokens(5) })

            /* The above code is using the JavaScript programming language and is calling the
            `finalizeSale` function on an `escrow` object, passing in the parameter `1`. It
            is then waiting for the transaction to be completed before continuing execution.
            The specific context and purpose of this code is not clear without additional
            information. */
            transaction = await escrow.connect(seller).finalizeSale(1)
            await transaction.wait()
        })

        /* The above code is a test case written in JavaScript using the Mocha testing framework. It is testing
        whether the ownership of a real estate asset with ID 1 has been successfully updated to the address
        of the buyer. The `expect` statement is checking if the result of the `ownerOf` function call on the
        `realEstate` contract instance is equal to the address of the `buyer` account. */
        it("Updates ownership", async () => {
            expect(await realEstate.ownerOf(1)).to.be.equal(buyer.address)
        })
        /* The above code is a test case written in JavaScript using the Mocha testing framework. It is testing
        the `getBalance` function of an `escrow` object to ensure that it returns a value of 0 for a given
        input parameter of 1. The `expect` function is used to make this assertion. */




        // it("Updates balance", async () => {
        //     expect(await escrow.getBalance(1)).to.be.equal(0)
        // })





        

    })

})




