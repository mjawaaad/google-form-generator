"use client";

import React, { useState } from "react";

const ToggleSwitch = () => {
  const [isSelected, setIsSelected] = useState(false);

  const handleToggle = () => {
    setIsSelected(!isSelected);
  };

  return (
    <div className={`toggle-switch ${isSelected ? "selected" : ""}`}>
      <label className="switch-label" htmlFor="toggle">
        Toggle Switch
      </label>
      <input
        type="checkbox"
        id="toggle"
        className="toggle-input"
        onChange={handleToggle}
        checked={isSelected}
      />
      <div className="slider"></div>
    </div>
  );
};

export default ToggleSwitch;
