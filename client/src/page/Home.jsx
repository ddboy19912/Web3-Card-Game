import React, { useEffect, useState } from 'react';
import { CustomButton, CustomInput, PageHOC } from '../components';
import { useGlobalContext } from '../context';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { contract, walletAddress, setShowAlert, setErrorMessage } =
    useGlobalContext();

  const navigate = useNavigate();

  const [playerName, setPlayerName] = useState('');

  const handleClick = async () => {
    try {
      const playerExists = await contract.isPlayer(walletAddress);

      if (!playerExists) {
        await contract.registerPlayer(playerName, playerName);

        setShowAlert({
          status: true,
          type: 'info',
          message: `${playerName} is being summoned`,
        });
      }

      setPlayerName('');
    } catch (error) {
      setErrorMessage(error);
      setPlayerName('');
    }
  };

  useEffect(() => {
    const checkForPlayerToken = async () => {
      const playerExists = await contract.isPlayer(walletAddress);
      const playerTokenExists = await contract.isPlayerToken(walletAddress);

      console.log(playerExists, playerTokenExists);

      if (playerExists && playerTokenExists) {
        navigate('/create-battle');
      }
    };

    if (contract) checkForPlayerToken();
  }, [contract]);

  return (
    <div className="flex flex-col">
      <CustomInput
        label="Player Name"
        placeholder="Enter Player Name"
        handleNameChange={setPlayerName}
        value={playerName}
      />
      <CustomButton
        title="Register"
        buttonStyle="mt-6"
        handleClick={handleClick}
      />
    </div>
  );
};

export default PageHOC(
  Home,
  <>
    Welcome to Avax Gods <br /> a Web3 NFT Card Game.
  </>,
  <>Connect your wallet to start playing the ultimate Web3 Battle Card Game.</>
);
