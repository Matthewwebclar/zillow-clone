import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import close from '../assets/close.svg';


const Home = ({ home, provider, account, escrow, toggleHome }) => {
    // console.log(`${account} None`)

    const [hasBought, setHasBought] = useState(false)
    const [hasLended, setHasLended] = useState(false)
    const [hasSold, setHasSold] = useState(false)
    const [hasInspected, setHasInspected] = useState(false)

    const [lender, setLender] = useState(false)
    const [inspector, setInspector] = useState(false)
    const [buyer, setBuyer] = useState(null)
    const [seller, setSeller] = useState(null)

    const [owner, setOwner] = useState(null)



    /**
     * The `fetchDetails` function fetches various details from an escrow contract related to a home,
     * including the buyer, seller, lender, inspector, and whether they have completed certain actions.
     */
    const fetchDetails = async () => {
        //Buyer
        /* This code is fetching the buyer of a particular home from the escrow contract and setting it
        to the `buyer` state variable using `setBuyer(buyer)`. It is also checking if the buyer has
        already bought the home by calling the `hasBought` function of the escrow contract with the
        `home.id` and `buyer` as arguments. The result of this function call is set to the
        `hasBought` state variable using `setHasBought(hasBought)`. */


        const buyer = await escrow.buyer(home.id)
        setBuyer(buyer)

        const hasBought = await escrow.approval(home.id, buyer)
        setHasBought(hasBought)

        //Seller
        const seller = await escrow.seller()
        setSeller(seller)

        const hasSold = await escrow.approval(home.id, seller)
        setHasSold(hasSold)

        //Lender
        const lender = await escrow.lender()
        setLender(lender)

        const hasLended = await escrow.approval(home.id, lender)
        setHasLended(hasLended)

        //Inspector
        const inspector = await escrow.inspector()
        setInspector(inspector)

        const hasInspected = await escrow.inspectionPassed(home.id)
        setHasInspected(hasInspected)
    }

    /**
     * This function fetches the owner of a home using an escrow contract and sets the owner state.
     * @returns If the home is listed in the escrow, nothing is returned. Otherwise, the owner of the
     * home is returned and set as the state of the component.
     */

    //Owner of the NFT
    const fetchOwner = async () => {
        if (await escrow.isListed(home.id)) return

        const owner = await escrow.buyer(home.id)

        setOwner(owner)

    }


    /**
     * The function handles the buying process of a home by depositing earnest, approving the sale, and
     * setting a flag to indicate that the purchase has been made.
     */

    //Buyer of the NFT
    const buyHandler = async () => {
        const escrowAmount = await escrow.escrowAmount(home.id)
        const signer = await provider.getSigner()

        // Buyer deposit earnest
        let transaction = await escrow.connect(signer).depositEarnest(home.id, { value: escrowAmount })
        await transaction.wait()

        // Buyer approves...
        transaction = await escrow.connect(signer).approveSale(home.id)
        await transaction.wait()

        setHasBought(true)
    }


    /**
     * This function updates the inspection status of a home in an escrow contract and sets a flag
     * indicating that the home has been inspected.
     */

    //Inspectiong home
    const inspectHandler = async () => {
        const signer = await provider.getSigner()

        //Inspector update status
        const transaction = await escrow.connect(signer).updateInspectionStatus(home.id, true);
        await transaction.wait()

        setHasInspected(true)
    }

    //LENDER
    /**
     * The lendHandler function allows a lender to approve the sale of an NFT and send funds to the
     * contract.
     */
    const lendHandler = async () => {
        /* `const signer = await provider.getSigner()` is getting the signer object from the provider.
        The signer object is used to sign transactions and messages with the private key associated
        with the account. It allows the user to interact with the blockchain and execute transactions
        on behalf of their account. */
        const signer = await provider.getSigner()

        //Lender approves the transaction sales of the NFT
        /* This code is approving the sale of an NFT by a lender in an escrow contract. It is calling the
        `approvedSale` function of the escrow contract with the `home.id` and `true` as arguments to
        indicate that the sale has been approved. The resulting transaction object is stored in the
        `transaction` variable using `let transaction = await
        escrow.connect(signer).approvedSale(home.id, true)`. The `wait()` function is then called on
        the transaction object to wait for the transaction to be confirmed on the blockchain. */

        // Lender approves...
        const transaction = await escrow.connect(signer).approveSale(home.id)
        await transaction.wait()

        //Lender sends funds to contract
        /* This code is calculating the amount of funds that a lender needs to send to the escrow
        contract to lend money for the purchase of a home. It does this by subtracting the escrow
        amount (the amount of earnest money deposited by the buyer) from the purchase price of the
        home (the amount that the buyer needs to pay to purchase the home). The resulting
        `lendAmount` is then converted to a string and sent to the escrow contract using the
        `sendTransaction` function of the signer object. The `gasLimit` parameter specifies the
        maximum amount of gas that can be used for the transaction. */

        // Lender sends funds to contract...
        const lendAmount = (await escrow.purchasePrice(home.id) - await escrow.escrowAmount(home.id))
        await signer.sendTransaction({ to: escrow.address, value: lendAmount.toString(), gasLimit: 60000 })


        /* `setHasLended(true)` is setting the state variable `hasLended` to `true`. This state variable
        is used to keep track of whether a lender has already approved and lent funds for the purchase
        of a home. Setting it to `true` indicates that the lender has approved and lent funds for the
        purchase of the home. */
        setHasLended(true)
    }

    //Sells home
    /**
     * The `sellHandler` function approves and finalizes the sale of a home through an escrow contract
     * and sets a state variable to indicate that the sale has been completed.
     */
    const sellHandler = async () => {
        const signer = await provider.getSigner()

        //seller approves
        let transaction = await escrow.connect(signer).approveSale(home.id);
        await transaction.wait()

        //Seller finalizes
        transaction = await escrow.connect(signer).finalizeSale(home.id)
        await transaction.wait()

        setHasSold(true)
    }

    useEffect(() => {
        fetchDetails()
        fetchOwner()
    }, [])


    return (
        <div className="home">
            <div className='home__details'>

                {/* IMAGE*/}
                <div className='home__image'>
                    <img src={home.image} />
                </div>

                {/**OVERVIEW */}
                <div className='home__overview'>
                    <h1>{home.name}</h1>

                    <p>
                        <strong>{home.attributes[1].value}</strong> abds |
                        <strong>{home.attributes[2].value}</strong> ba |
                        <strong>{home.attributes[3].value}</strong> sqft
                    </p>

                    <p>{home.address}</p>

                    <h2>{home.attributes[0].value} ETH</h2>

                    {owner ? (
                        <div className='home__owned'>
                            Owned by {owner.slice(0, 6) + '...' + owner.slice(38, 42)}
                        </div>
                    ) : (
                        <div>
                            {(account === inspector) ? (
                                <button className='home__buy' onClick={inspectHandler} disabled={hasInspected}>
                                    Approve Inspection
                                </button>
                            ) : (account === lender) ? (
                                <button className='home__buy' onClick={lendHandler} disabled={hasLended}>
                                    Approve & Lend
                                </button>
                            ) : (account === seller) ? (
                                <button className='home__buy' onClick={sellHandler} disabled={hasSold}>
                                    Approve & Sell
                                </button>
                            ) : (
                                <button className='home__buy' onClick={buyHandler} disabled={hasBought}>
                                    Buy
                                </button>
                            )}

                            <button className='home__contact'>
                                Contact agent
                            </button>
                        </div>
                    )}
                    <hr />

                    <h2>Facts and features</h2>
                    <ul>{home.attributes.map((attribute, index) => (
                        <li key={index}>
                            <stong>
                                {attribute.trait_type}
                            </stong>
                            {attribute.value}
                        </li>
                    ))}</ul>
                </div>

                <button onClick={toggleHome} className="home__close">
                    <img src={close} alt="Close" />
                </button>

            </div>
        </div>
    );
}

export default Home;
