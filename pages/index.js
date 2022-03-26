import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { ethers } from "ethers";
import "react-toastify/dist/ReactToastify.css";

import Head from "next/head";
import abi from "../utils/faucet.sol/faucet.json";

export default function Home() {
  /**
   * Create a variable here that holds the contract address after you deploy!
   */
  const contractAddress = "0x0438A0893B38fc6fae79DaB21A09b14d96bE1115";

  /**
   * Create a variable here that references the abi content!
   */
  const contractABI = abi.abi;

  /*
   * Just a state variable we use to store our user's public wallet.
   */
  const [currentAccount, setCurrentAccount] = useState("");

  const [address, setAddress] = useState("");

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      /*
       * Check if we're authorized to access the user's wallet
       */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        setCurrentAccount(account);
        toast.success("🦄 Wallet is Connected", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.warn("Make sure you have MetaMask Connected", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      toast.error(`${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        toast.warn("Make sure you have MetaMask Connected", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const getTokens = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const FaucetContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const Txn = await FaucetContract.getTokens(address);
        console.log("Mining...", Txn.hash);

        toast.info("Sending Fund to Address...", {
          position: "top-left",
          autoClose: 18050,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        
        await Txn.wait();

        console.log("Mined -- ", Txn.hash);

        setAddress("");

        toast.success("Address Funded!", {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      toast.error(`${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
 /*
   * This runs our function when the page loads.
   */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const handleOnAddressChange = (event) => {
    const { value } = event.target;
    setAddress(value);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Poly Lotto Faucet</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h3 className="text-4xl font-bold text-green-500 mb-6">
          Poly Lotto Faucet
        </h3>

        {/*
         * If there is currentAccount render this form, else render a button to connect wallet
         */}

        {currentAccount ? (
          <div className="w-full max-w-xs sticky top-3 z-50 ">
            <text className="text-sm text-gray-500"><a className="hover:bg-gray-200" href="https://mumbai.polygonscan.com/address/0xe75613bc32e3ec430aDbD46D8dDf44C2b7F82071" target="_blank" rel="noopener noreferrer">View Token</a></text>
            <form className="bg-white rounded px-8 pt-6 pb-8 mb-4">
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="address"
                >
                  Enter Wallet Address
                </label>
                <input
                  className=" text-sm shadow appearance-none py-2 px-3 border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="Address"
                  type="text"
                  placeholder="Address"
                  onChange={handleOnAddressChange}
                  required
                />
              </div>
              <div className="cen">
                <button
                  className="bg-green-500 hover:bg-green-700 text-center text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={getTokens}
                >
                  Get Test Tokens
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <p className="text-2xl text-green-600 mb-6">
              Switch your wallet to Mumbai Testnet Network to use this application.
            </p>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-full mt-3"
              onClick={connectWallet}
            >
              Connect Your Wallet
            </button>
          </div>
        )}
      </main>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
