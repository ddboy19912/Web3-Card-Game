import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from '../styles';
import { useGlobalContext } from '../context';
import { CustomButton, CustomInput, PageHOC, GameLoad } from '../components';

const CreateBattle = () => {
  const navigate = useNavigate();

  const [waitBattle, setWaitBattle] = useState(false);

  const { contract, battleName, setBattleName, gameData, setErrorMessage } =
    useGlobalContext();

  useEffect(() => {
    if (gameData?.activeBattle?.battleStatus === 1) {
      navigate(`/battle/${gameData.activeBattle.name}`);
    } else if (gameData?.activeBattle?.battleStatus === 0) {
      // setWaitBattle(true);
    }
  }, [gameData]);

  console.log(gameData);

  const handleClick = async () => {
    if (battleName === '' || battleName.trim() === '') return null;

    try {
      await contract.createBattle(battleName);
      setWaitBattle(true);
    } catch (error) {
      setErrorMessage(error);
    }
  };

  return (
    <>
      {waitBattle && <GameLoad />}
      <div className="flex flex-col mb-5">
        <CustomInput
          label="Battle"
          placeholder="Enter Battle Name"
          value={battleName}
          handleNameChange={setBattleName}
        />
        <CustomButton
          title="Create Battle"
          handleClick={handleClick}
          buttonStyle="mt-6"
        />
      </div>

      <p className={styles.infoText} onClick={() => navigate('/join-battle')}>
        Or join already existing battles
      </p>
    </>
  );
};

export default PageHOC(
  CreateBattle,
  <>
    Create <br /> a new Battle.
  </>,
  <>Create your own battle and wait for other players to join you.</>
);
