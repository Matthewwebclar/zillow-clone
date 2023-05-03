import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers';

// Components
import Navigation from './components/Navigation';
import Search from './components/Search';
import Home from './components/Home';
import Main from './components/Main';

// ABIs
import RealEstate from './abis/RealEstate.json'
import Escrow from './abis/Escrow.json'

// Config
import config from './config.json';

const App = () => {
  const [provider, setProvider] = useState(null)
  const [escrow, setEscrow] = useState(null)

  const [account, setAccount] = useState(null)

  const [homes, setHomes] = useState([])
  const [home, setHome] = useState({})
  const [toggle, setToggle] = useState(false)

  const loadBlockchainData = async () => {
    /* `const provider = new ethers.providers.Web3Provider(window.ethereum)` is creating a new instance
    of the `Web3Provider` class from the `ethers` library, using the `window.ethereum` object as the
    provider. This allows the application to interact with the Ethereum blockchain using the user's
    web3-enabled browser. */

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    console.log(window.ethereum)

    setProvider(provider)
    /* `const network = await provider.getNetwork()` is using the `getNetwork()` method from the `provider`
    object to retrieve information about the current Ethereum network that the user is connected to.
    This information includes the network ID, name, and chain ID. The `await` keyword is used to wait
    for the network information to be retrieved before continuing with the rest of the code. The
    `network` variable is then set to the retrieved network information. */
    const network = await provider.getNetwork()



    /* This code is creating a new instance of the `ethers.Contract` class, which allows the
    application to interact with a smart contract on the Ethereum blockchain. The
    `config[network.chainId].realEstate` parameter specifies the address of the smart contract that
    the application wants to interact with, while the `RealEstate` parameter specifies the ABI
    (Application Binary Interface) of the smart contract. The `provider` parameter specifies the
    Ethereum provider that the application is using to interact with the blockchain. */
    const realEstate = new ethers.Contract(config[network.chainId].realEstate.address, RealEstate, provider)

    /* `const totalSupply = await realEstate.totalSupply()` is calling the `totalSupply()` function from
    the `RealEstate` smart contract and retrieving the total number of homes that have been created
    and registered on the blockchain. The `await` keyword is used to wait for the function to return
    a value before assigning it to the `totalSupply` variable. */
    const totalSupply = await realEstate.totalSupply()
    // console.log(totalSupply.toString())

    /* `const homes = []` is initializing an empty array called `homes`. This array will be used to
    store the metadata of all the homes that have been created and registered on the blockchain. The
    metadata will be retrieved using the `tokensURI()` function from the `RealEstate` smart contract
    and then pushed into the `homes` array. */

    /*Store metadata/info of all the homes that has been created on the chain
    we will retrieve the metadata using tokensURI func
    */
    const homes = []

    /* This code is looping through all the homes that have been created and registered on the blockchain
    and retrieving their metadata. */
    for (var i = 1; i <= totalSupply; i++) {
      const uri = await realEstate.tokenURI(i)
      const response = await fetch(uri)
      const metadata = await response.json()
      homes.push(metadata)
      // console.log(homes)
    }

    /* `setHomes(homes)` is updating the state variable `homes` with the value of the `homes` array that
    contains the metadata of all the homes that have been created and registered on the blockchain. This
    allows the applicatiop to access and display the metadata of the homes in the UI. */
    setHomes(homes)

    /* This code is creating a new instance of the `ethers.Contract` class, which allows the
    application to interact with a smart contract on the Ethereum blockchain. The
    `config[network.chainId].escrow` parameter specifies the address of the smart contract that the
    application wants to interact with, while the `Escrow` parameter specifies the ABI (Application
    Binary Interface) of the smart contract. The `provider` parameter specifies the Ethereum
    provider that the application is using to interact with the blockchain. Once the instance of the
    `ethers.Contract` class is created, it is assigned to the `escrow` state variable using the
    `setEscrow()` function. This allows the application to access and interact with the `Escrow`
    smart contract in the UI. */
    const escrow = new ethers.Contract(config[network.chainId].escrow.address, Escrow, provider)
    setEscrow(escrow)


    /* This code is setting up an event listener for the `accountsChanged` event emitted by the user's
    web3-enabled browser. When the user switches to a different Ethereum account in their browser,
    this event is emitted and the code inside the event listener is executed. */
    window.ethereum.on("accountsChanged", async () => {
      /* `const accounts = await window.ethereum.request({ method: 'eth_thereumAccounts' })` is using
      the `request()` method of the `window.ethereum` object to send a request to the user's
      web3-enabled browser to retrieve the Ethereum accounts that the user has authorized the
      application to access. The `method` parameter specifies the type of request being made, which
      in this case is to retrieve the Ethereum accounts. The `await` keyword is used to wait for the
      response from the browser before assigning the retrieved accounts to the `accounts` variable. 
      DELETE LATER
      */
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      /* `const account = ethers.utils.getAddress(accounts[0])` is using the `getAddress()` method from
      the `ethers.utils` object to convert the Ethereum address in `accounts[0]` to a checksummed
      address format. This ensures that the address is in the correct format and can be used in
      Ethereum transactions without any errors. The resulting checksummed address is then assigned
      to the `account` variable. */
      const account = ethers.utils.getAddress(accounts[0])
      // console.log(account)
      /* `setAccount(account)` is updating the state variable `account` with the value of the `account`
      variable. This allows the application to access and display the user's Ethereum account address
      in the UI. The `setAccount()` function is a React hook that is used to update the state of a
      component. When the state is updated, React re-renders the component with the new state values. */
      setAccount(account)

    })

  }

  /* `useEffect(() => { loadBlockchainData() }, [])` is a React hook that is used to run the
  `loadBlockchainData()` function when the component is mounted. The empty array `[]` passed as the
  second argument to `useEffect()` ensures that the function is only run once, when the component is
  mounted. This hook is commonly used for fetching data or setting up event listeners when a component
  is first rendered. */
  useEffect(() => { loadBlockchainData() }, [])

  /**
   * The function toggles a boolean state variable called "toggle" and updates the "home" state variable.
   */
  const toggleHome = () => {

    setHome(homes)
    /* The code `toggle ? setToggle(false) : setToggle(true)` is a ternary operator that toggles the
    value of the `toggle` state variable between `true` and `false`. If `toggle` is currently `true`,
    then the expression evaluates to `setToggle(false)`, which sets the value of `toggle` to `false`.
    If `toggle` is currently `false`, then the expression evaluates to `setToggle(true)`, which sets
    the value of `toggle` to `true`. This is used in conjunction with the `togglePop()` function to
    toggle the visibility of a popup or modal in the UI. */
    toggle ? setToggle(false) : setToggle(true)
  }


  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      <Search />

      <div className='cards__section'>
        <h3>Find your place</h3>
        <hr />
        <Main />
        <div className='cards'>
          {
            homes.map((home, index) => (
              <div className='card' key={index} onClick={() => toggleHome(home)}>
                <div className='card__image'>
                  <img src={home.image} alt='Home' />
                </div>

                <div className='card__info'>
                  <h4>{home.attributes[0].value} ETH</h4>
                  <p>
                    <strong>{home.attributes[1].value}</strong> abds |
                    <strong>{home.attributes[2].value}</strong> ba |
                    <strong>{home.attributes[3].value}</strong> sqft
                  </p>
                  <p>{home.address}</p>
                </div>
                {
                  toggle && (
                    <Home home={home} provider={provider} account={account} escrow={escrow} togglePop={toggleHome} />

                  )

                }

              </div>
            ))
          }
        </div>

      </div>
      {/*HOME COMPONENT - MODAL */}
      {toggle && (""
        // <Home home={home} provider={provider} account={account} escrow={escrow} togglePop={toggleHome} />
      )}
    </div>
  )
}

export default App
