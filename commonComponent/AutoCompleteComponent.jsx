import React from 'react';
import { View, TextInput, Text, FlatList, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

const AutocompleteComponent = ({
  options,
  label,
  placeholder,
  value,
  onChange,
  getOptionLabel,
  renderOption,
  className,
  textInputStyle,
  containerStyle,
  ...props
}) => {
  const [filteredOptions, setFilteredOptions] = React.useState([]);
  const [isFocused, setIsFocused] = React.useState(false);

  const handleInputChange = (text) => {
    const newFilteredOptions = options.filter((option) =>
      getOptionLabel(option).toLowerCase().includes(text.toLowerCase())
    );
    setFilteredOptions(newFilteredOptions);
    onChange(text);
  };

  const handleOptionSelect = (option) => {
    onChange(getOptionLabel(option));
    setFilteredOptions([]);
    setIsFocused(false);
  };

  return (
    <View className={`w-full relative ${containerStyle}`}>
      {label && <Text className="text-sm mb-2 text-gray-700">{label}</Text>}
      <TextInput
        value={value}
        onChangeText={handleInputChange}
        placeholder={placeholder}
        className={`border border-gray-300 rounded-md px-2 ${textInputStyle}`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {isFocused && filteredOptions.length > 0 && (
        <FlatList
          data={filteredOptions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleOptionSelect(item)}
              className="p-0 bg-white border-gray-300 text-black"
            >
              {renderOption ? renderOption(item) : <Text className="text-black">{getOptionLabel(item)}</Text>}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

AutocompleteComponent.propTypes = {
  options: PropTypes.array.isRequired,
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  getOptionLabel: PropTypes.func,
  renderOption: PropTypes.func,
  textInputStyle: PropTypes.string,
  containerStyle: PropTypes.string,
};

AutocompleteComponent.defaultProps = {
  getOptionLabel: (option) => option,
};

export default AutocompleteComponent;
