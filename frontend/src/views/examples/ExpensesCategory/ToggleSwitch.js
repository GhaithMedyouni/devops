import React from 'react';

const ToggleSwitch = ({ isChecked, onChange }) => {
  const switchStyle = {
    display: 'inline-block',
    width: '34px',
    height: '20px',
    position: 'relative'
  };

  const sliderStyle = {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: isChecked ? '#4CAF50' : '#ccc',
    transition: '.4s',
    borderRadius: '20px'
  };

  const sliderBeforeStyle = {
    position: 'absolute',
    content: '""',
    height: '14px',
    width: '14px',
    left: isChecked ? '14px' : '2px',
    bottom: '3px',
    backgroundColor: 'white',
    transition: '.4s',
    borderRadius: '50%'
  };

  return (
    <label style={switchStyle}>
      <input type="checkbox" checked={isChecked} onChange={onChange} style={{ display: 'none' }} />
      <span style={sliderStyle}>
        <span style={sliderBeforeStyle}></span>
      </span>
    </label>
  );
};

export default ToggleSwitch;
