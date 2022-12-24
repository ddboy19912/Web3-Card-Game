import React from 'react';
import { useNavigate } from 'react-router-dom';

import { logo, heroImg } from '../assets';
import styles from '../styles';

import { useGlobalContext } from '../context';
import Alert from './Alert';

const PageHOC = (Component, title, description) => () => {
  const navigate = useNavigate();

  const { showAlert, walletAddress } = useGlobalContext();

  return (
    <div className={styles.hocContainer}>
      {showAlert?.status && (
        <Alert type={showAlert.type} message={showAlert.message} />
      )}
      <div className={styles.hocContentBox}>
        <div className="flex items-center justify-between">
          <img
            src={logo}
            alt="logo"
            className={styles.hocLogo}
            onClick={() => navigate('/')}
          />

          {walletAddress && <h1 className="text-white text-4xl ">Connected</h1>}
        </div>

        <div className={styles.hocBodyWrapper}>
          <h1 className={`flex ${styles.headText} head-text`}>{title}</h1>
          <p className={`${styles.normalText} my-10`}>{description}</p>
          <Component />
          <p className={`${styles.footerText} mt-8`}>
            Made with 💜 by Fortune.
          </p>

          <div className="flex flex-1 mt-4">
            <img
              src={heroImg}
              alt="hero-img"
              className="w-full xl:h-full object-cover "
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHOC;
