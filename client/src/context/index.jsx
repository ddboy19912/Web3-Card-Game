import React, {
  useContext,
  useRef,
  useEffect,
  useState,
  createContext,
} from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { useNavigate } from 'react-router-dom';
import { ABI, contractAddress } from '../contracts';
import { createEventListeners } from './createEventListeners';
import { GetParams } from '../utils/onboard.js';

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState('');

  const [provider, setProvider] = useState('');

  const [contract, setContract] = useState('');

  const [showAlert, setShowAlert] = useState({
    status: false,
    type: 'info',
    message: '',
  });

  const [battleName, setBattleName] = useState('');
  const [gameData, setGameData] = useState({
    players: [],
    pendingBattles: [],
    activeBattle: null,
  });

  const [updateGameData, setUpdateGameData] = useState(0);

  const [battleGround, setBattleGround] = useState('bg-astral');
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const player1Ref = useRef();
  const player2Ref = useRef();

  useEffect(() => {
    const isBattleGroundLocalStore = localStorage.getItem('battleground');

    if (isBattleGroundLocalStore) {
      setBattleGround(isBattleGroundLocalStore);
    } else {
      localStorage.setItem('battleground', battleGround);
    }
  }, []);

  //* Reset web3 onboarding modal params
  useEffect(() => {
    const resetParams = async () => {
      const currentStep = await GetParams();

      setStep(currentStep.step);
    };

    resetParams();

    window?.ethereum?.on('chainChanged', () => resetParams());
    window?.ethereum?.on('accountsChanged', () => resetParams());
  }, []);

  // Set Wallet Address to State
  const updateCurrentWallet = async () => {
    const accounts = await window?.ethereum?.request({
      method: 'eth_accounts',
      // method: 'eth_requestAccounts',
    });

    if (accounts) setWalletAddress(accounts[0]);
  };

  useEffect(() => {
    updateCurrentWallet();

    window?.ethereum?.on('accountsChanged', updateCurrentWallet);
  }, []);

  useEffect(() => {
    if (step !== 1 && contract) {
      createEventListeners({
        navigate,
        contract,
        provider,
        walletAddress,
        setShowAlert,
        setUpdateGameData,
        player1Ref,
        player2Ref,
      });
    }
  }, [contract, step]);

  // Set Smart Contract and Provider to the state
  useEffect(() => {
    const setSmartContractAndProvider = async () => {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const newProvider = new ethers.providers.Web3Provider(connection);
      const signer = newProvider.getSigner();
      const newContract = new ethers.Contract(
        '0xcfeF49b95843e04aF864c3084FEcE32961fB64Fa',
        ABI,
        signer
      );

      setProvider(newProvider);
      setContract(newContract);
    };

    setSmartContractAndProvider();
  }, []);

  useEffect(() => {
    if (showAlert?.status) {
      const timer = setTimeout(() => {
        setShowAlert({
          status: false,
          type: 'info',
          message: '',
        });
      }, [5000]);

      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  // Set Game data to state
  useEffect(() => {
    const fetchGameData = async () => {
      if (contract) {
        const fetchedBattles = await contract.getAllBattles();
        console.log(fetchedBattles);
        const pendingBattles = fetchedBattles.filter(
          (battle) => battle.battleStatus === 0
        );
        let activeBattle = null;

        fetchedBattles.forEach((battle) => {
          if (
            battle.players.find(
              (player) => player.toLowerCase() === walletAddress.toLowerCase()
            )
          ) {
            if (battle.winner.startsWith('0x00')) {
              activeBattle = battle;
            }
          }
        });

        setGameData({ pendingBattles: pendingBattles.slice(1), activeBattle });
      }
    };

    if (contract) fetchGameData();
  }, [contract, updateGameData]);

  //* Handle error messages
  useEffect(() => {
    if (errorMessage) {
      const parsedErrorMessage = errorMessage?.reason
        ?.slice('execution reverted: '.length)
        .slice(0, -1);

      if (parsedErrorMessage) {
        setShowAlert({
          status: true,
          type: 'failure',
          message: parsedErrorMessage,
        });
      }
    }
  }, [errorMessage]);

  return (
    <GlobalContext.Provider
      value={{
        contract,
        walletAddress,
        showAlert,
        setShowAlert,
        battleName,
        setBattleName,
        gameData,
        battleGround,
        setBattleGround,
        errorMessage,
        setErrorMessage,
        player1Ref,
        player2Ref,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
