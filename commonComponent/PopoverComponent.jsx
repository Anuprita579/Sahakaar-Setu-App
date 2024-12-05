import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, Modal, Dimensions, TouchableWithoutFeedback } from "react-native";
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
  const buttonRef = useRef(null); // To get button position
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });

  const measureButtonPosition = () => {
    buttonRef.current.measure((fx, fy, width, height, px, py) => {
      const screenWidth = Dimensions.get("window").width;
      const centerX = px + width / 2; // Center of the button
      const topY = py + height; // Bottom of the button
      setButtonPosition({
        top: topY,
        left: centerX - (popoverStyle?.width || 200) / 2, // Center the popover horizontally
      });
    });
  };

  const handlePress = () => {
    measureButtonPosition();
    togglePopover(!open);
  };

  const closePopover = () => {
    togglePopover(false); // Close the popover
  };

  return (
    <View>
      <TouchableOpacity
        onPress={handlePress}
        className={buttonClassName} // Applying NativeWind class here
        accessibilityLabel={buttonId}
        ref={buttonRef} // Reference for positioning
      >
        <Text>{buttonContent}</Text>
      </TouchableOpacity>
      
      <View>
        {open && (
          <Modal
            transparent
            animationType="fade"
            visible={open}
            onRequestClose={closePopover}
          >
            <View className="flex-1 justify-start items-center bg-red-600 relative">
              <TouchableWithoutFeedback onPress={closePopover}>
                <View className="absolute top-0 left-0 w-full h-full" />
              </TouchableWithoutFeedback>

              <View
                className={`${popoverClassName} absolute`} // Applying NativeWind class here
                style={[
                  popoverStyle,
                  {
                    position: "absolute",
                    top: buttonPosition.top,
                    left: buttonPosition.left,
                  },
                ]}
              >
                <Text>{popoverContent}</Text>
              </View>
            </View>
          </Modal>
        )}
      </View>
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
