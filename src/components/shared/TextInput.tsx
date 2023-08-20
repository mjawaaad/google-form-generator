// src/components/TextInput.js
import React from "react";

const TextInput = ({
  className,
  placeholder,
  type,
  value,
  handleChange,
  name,
}: {
  className: string;
  placeholder: string;
  type: string;
  value?: string;
  handleChange?: React.ChangeEventHandler<HTMLInputElement>;
  name?: string;
}) => {
  return (
    <input
      type={type}
      className={` rounded ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      name={name}
    />
  );
};

export default TextInput;
