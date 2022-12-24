import React from 'react';

import styles from '../styles';

const CustomButton = ({ title, handleClick, buttonStyle }) => {
  return (
    <button
      type="button"
      className={`${styles.btn} ${buttonStyle}`}
      onClick={handleClick}
    >
      {title}
    </button>
  );
};

export default CustomButton;
