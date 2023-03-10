import { ethers } from 'ethers';

import { ABI } from '../contracts';

import { playAudio, sparcle } from '../utils/animation.js';
import { defenseSound } from '../assets';

const emptyAccount = '0x0000000000000000000000000000000000000000';

const AddNewEvent = (eventFilter, provider, callback) => {
  provider.removeListener(eventFilter);

  provider.on(eventFilter, (logs) => {
    const parsedLogs = new ethers.utils.Interface(ABI).parseLog(logs);

    callback(parsedLogs);
  });
};

const getCoords = (cardRef) => {
  const { left, top, width, height } = cardRef.current.getBoundingClientRect();

  return {
    pageX: left + width / 2,
    pageY: top + height / 2.25,
  };
};

export const createEventListeners = ({
  navigate,
  contract,
  provider,
  walletAddress,
  setShowAlert,
  setUpdateGameData,
  player1Ref,
  player2Ref,
}) => {
  const NewPlayerEventFilter = contract.filters.NewPlayer();

  AddNewEvent(NewPlayerEventFilter, provider, ({ args }) => {
    console.log('New Player created', args);

    if (walletAddress === args.owner) {
      setShowAlert({
        status: true,
        type: 'success',
        message: 'Player has been added successfully',
      });
    }
  });

  const NewBattleEventFilter = contract.filters.NewBattle();

  AddNewEvent(NewBattleEventFilter, provider, ({ args }) => {
    console.log('New Battle Started', args, walletAddress);

    if (
      walletAddress.toLowerCase() === args.player1.toLowerCase() ||
      walletAddress.toLowerCase() === args.player2.toLowerCase()
    ) {
      navigate(`/battle/${args.battleName}`);
    }
    setUpdateGameData((prevUpdateGameData) => prevUpdateGameData + 1);
  });

  const BattleMoveEventFilter = contract.filters.BattleMove();
  AddNewEvent(BattleMoveEventFilter, provider, ({ args }) => {
    console.log('Battle move initiated', args);
  });

  const RoundEndedEventFilter = contract.filters.RoundEnded();
  AddNewEvent(RoundEndedEventFilter, provider, ({ args }) => {
    console.log('Round ended!', args, walletAddress);

    for (let i = 0; i < args.damagedPlayers.length; i += 1) {
      if (args.damagedPlayers[i] !== emptyAccount) {
        if (args.damagedPlayers[i] === walletAddress) {
          sparcle(getCoords(player1Ref));
        } else if (args.damagedPlayers[i] !== walletAddress) {
          sparcle(getCoords(player2Ref));
        }
      } else {
        playAudio(defenseSound);
      }
    }

    setUpdateGameData((prevUpdateGameData) => prevUpdateGameData + 1);
  });
};
