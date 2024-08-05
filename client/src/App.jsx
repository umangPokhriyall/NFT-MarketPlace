import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Create from "./Components/Create"
import Buy from "./Components/Buy"
import List from "./Components/List"
import Navbar from "./Components/Navbar"
import MyNFTArtifact from './contracts/MyNFT.json';
import MarketplaceArtifact from './contracts/Marketplace.json';
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';


function App() {
  const [web3Api, setWeb3Api] = useState({
    provider : null,
    web3 : null,
    nft : null,
    market : null,
  }); 

  const [account, setAccount] = useState(null)

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      
      if (provider) {
        const web3 = new Web3(provider);      
        const networkId = await web3.eth.net.getId();
        const deployedNetworkN = MyNFTArtifact.networks[networkId];
        const nft = new web3.eth.Contract(
          MyNFTArtifact.abi,
          deployedNetworkN && deployedNetworkN.address
        );
        const deployedNetworkM = MarketplaceArtifact.networks[networkId];
        const market = new web3.eth.Contract(
          MarketplaceArtifact.abi,
          deployedNetworkM && deployedNetworkM.address
        );
        setWeb3Api({
          web3,
          provider,
          nft,
          market
        });
      
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0].toLowerCase());


      provider.on('accountsChanged', (accounts) => setAccount(accounts[0].toLowerCase()));

    } else {
      console.error('Please install MetaMask!');
    }
    };
    loadProvider();
    
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <><Navbar /><Create web3={web3Api.web3} account={account} nft={web3Api.nft} market={web3Api.market}/></>
    },
    {
      path: "/list",
      element: <><Navbar /><List web3={web3Api.web3} account={account} nft={web3Api.nft} market={web3Api.market}/></>
    },
    {
      path: "/buy",
      element: <><Navbar /><Buy web3={web3Api.web3} account={account} market={web3Api.market}/></>
    },
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
