import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import PropTypes from "prop-types";

function PopoverComponent({
  open,
  togglePopover,
  buttonContent,
  buttonClassName,
  popoverContent,
  buttonId,
  popoverClassName,
  popoverStyle,
}) {
  return (
    <View>
      <TouchableOpacity
        onPress={() => togglePopover(!open)}
        className={buttonClassName} // Applying NativeWind class here
        accessibilityLabel={buttonId}
      >
        <Text>{buttonContent}</Text>
      </TouchableOpacity>

      {open && (
        <Modal
          transparent
          animationType="fade"
          visible={open}
          onRequestClose={() => togglePopover(false)}
        >
          <View className="flex-1 justify-center items-center">
            <View
              className={`${popoverClassName} absolute`} // Applying NativeWind class here
              style={popoverStyle}
            >
              {popoverContent}
            </View>
            <TouchableOpacity
              className="absolute top-0 left-0 w-full h-full"
              onPress={() => togglePopover(false)} // Close the popover when clicking outside
            />
          </View>
        </Modal>
      )}
    </View>
  );
}

PopoverComponent.propTypes = {
  buttonContent: PropTypes.node.isRequired,
  popoverContent: PropTypes.node.isRequired,
  open: PropTypes.bool.isRequired, // We pass the open state
  togglePopover: PropTypes.func.isRequired, // Function to toggle popover visibility
  buttonId: PropTypes.string,
  buttonClassName: PropTypes.string,
  popoverClassName: PropTypes.string,
  popoverStyle: PropTypes.object,
};

export default PopoverComponent;
