import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CustomButton from './CustomButton';
import { useGlobalContext } from '../context';
import { SoundLogo, alertIcon, gameRules, MuteLogo } from '../assets';
import styles from '../styles';

const GameInfo = ({ isPlaying, handlePlay }) => {
  const { contract, gameData, setErrorMessage, setShowAlert } =
    useGlobalContext();
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const navigate = useNavigate();

  const handleBattleExit = async () => {
    const battleName = gameData.activeBattle.name;
    try {
      await contract.quitBattle(battleName);
      setShowAlert({
        status: true,
        type: 'info',
        message: `You're quitting the ${battleName}`,
      });
      navigate('/');
    } catch (error) {
      setErrorMessage(error);
      console.log(error);
    }
  };

  return (
    <>
      <div className={styles.gameInfoIconBox}>
        <div
          className={`${styles.gameInfoIcon} ${styles.flexCenter}`}
          onClick={() => setToggleSidebar(true)}
        >
          <img src={alertIcon} alt="info" className={styles.gameInfoIconImg} />
        </div>
      </div>

      <div
        className={`${styles.gameInfoSidebar} ${
          toggleSidebar ? 'translate-x-0' : 'translate-x-full'
        } ${styles.glassEffect} ${styles.flexBetween} backdrop-blur-3xl`}
      >
        <div className="flex flex-col">
          <div className="flex justify-between mb-5">
            {/*  */}
            <div
              onClick={() => handlePlay(!isPlaying)}
              className="bg-violet-700 text-white p-3 rounded-full cursor-pointer"
            >
              <img
                className="w-4 text-white"
                src={isPlaying ? SoundLogo : MuteLogo}
              />
            </div>
            <div
              className={`${styles.flexCenter} ${styles.gameInfoSidebarClose}`}
              onClick={() => setToggleSidebar(false)}
            >
              X
            </div>
          </div>

          <h3 className={styles.gameInfoHeading}>Game Rules:</h3>

          <div className="mt-3">
            {gameRules.map((rule, index) => (
              <p key={`game-rule-${index}`} className={styles.gameInfoText}>
                <span className="font-bold">{index + 1}</span>. {rule}
              </p>
            ))}
          </div>
        </div>

        <div className={`${styles.flexBetween} mt-10 gap-4 w-full`}>
          <CustomButton
            title="Change Battleground"
            handleClick={() => navigate('/battleground')}
          />
          <CustomButton
            title="Exit Battle"
            handleClick={() => handleBattleExit()}
          />
        </div>
      </div>
    </>
  );
};

export default GameInfo;
