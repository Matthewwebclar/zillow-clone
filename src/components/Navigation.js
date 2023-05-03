import React from 'react';
import { ethers } from 'ethers';
import logo from '../assets/logoo.svg';

const Navigation = ({ account, setAccount }) => {

    const connectHandler = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = ethers.utils.getAddress(accounts[0])
        setAccount(account);
    }

    return (
        <nav>
            <ul className='nav__links'>
                <li><a href='#buy'>Buy</a></li>
                <li><a href='#rent'>Rent</a></li>
                <li><a href='#sell'>Sell</a></li>
                <li><a href='#home'>Home <span>Loans</span></a></li>
                <li><a href='#agent'>Agent <span>Finder</span></a></li>
            </ul>

            <div className='nav__brand'>
                <img src={logo} alt='Logo' style={{ width: "120px", height: "25px" }} />

            </div>

            {
                account ? (
                    <button type='button' className='nav__connect'>{account.slice(0, 6) + '...' + account.slice(38, 42)}</button>
                ) : (

                    <button type='button' className='nav__connect' onClick={connectHandler}>connect</button>
                )
            }
        </nav>
    )
}

export default Navigation;
