import React from "react";

const SelectInput = () => {
  return (
    <select
      id="inputType"
      className="appearance-none border cursor-pointer focus:outline-none basis-1/3 border-gray-400 p-2 rounded"
    >
      <option className="text-bold option" selected value="radio">
        Radio
      </option>
      <option value="text">Text</option>
      <option value="checkbox">Checkbox</option>
      <option value="dropdown">Dropdown</option>
    </select>
  );
};

export default SelectInput;
