import React from 'react';

import styles from '../styles';

const regex = /^[A-Za-z0-9]+$/;

const CustomInput = ({ label, value, handleNameChange, placeholder }) => {
  return (
    <>
      <label htmlFor="name" className={styles.label}>
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        className={styles.input}
        onChange={(e) => {
          if (e.target.value === '' || regex.test(e.target.value))
            handleNameChange(e.target.value);
        }}
      />
    </>
  );
};

export default CustomInput;
