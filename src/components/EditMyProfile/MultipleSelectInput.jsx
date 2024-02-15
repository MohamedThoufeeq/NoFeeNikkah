import React, { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';

const MultipleSelectInput = ({ inputData, setArray, isLanguage, onCreateOption }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    setOptions(inputData.map(item => ({
      value: item.code || item.value, // Assuming language has "code" and scholars have "value"
      label: isLanguage ? `${item.name} (${item.nativeName})` : item.label // Format label differently for language and scholars
    })));
  }, [inputData, isLanguage]);

  const handleChange = (newValue, actionMeta) => {
    setSelectedOptions(newValue);
  };

  const handleCreate = (inputValue) => {
    const newOption = { value: inputValue.toLowerCase(), label: inputValue };
    setSelectedOptions([...selectedOptions, newOption]);
    setOptions([...options, newOption]);
  };

  useEffect(() => {
    setArray(selectedOptions.map(option => option.value));
  }, [selectedOptions, setArray]);

  if(onCreateOption === true){
      return (
        <CreatableSelect
          isMulti
          options={options}
          value={selectedOptions}
          onChange={handleChange}
          onCreateOption={ onCreateOption ? handleCreate : null}
          placeholder="Type to search..."
          styles={customStyles}
        />
      );
  } else {
        return (
            <Select
                isMulti
                options={options}
                value={selectedOptions}
                onChange={handleChange}
                placeholder="Type to search..."
                styles={customStyles}
            />
    )
  }
};
const customStyles = {
    option: (provided, state) => ({
      ...provided,
      cursor: 'pointer',
      backgroundColor: state.isSelected ? '#f0f0f0' : state.isFocused ? '#cceeff' : 'transparent',
    }),
    control: (provided) => ({
      ...provided,
      cursor:'text',
    }),
    indicatorsContainer:(provided) => ({
      ...provided,
      cursor: 'pointer',
    }),
    multiValue:(provided) => ({
      ...provided,
      borderRadius: '5px',
    })
  };
export default MultipleSelectInput;