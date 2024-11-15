import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import PropTypes from "prop-types";

// Use NativeWind classes directly in the component
function PopoverComponent({
  anchorEl,
  handleClick,
  handleClose,
  buttonContent,
  buttonId,
  popoverContent,
  anchorOrigin = { vertical: "bottom", horizontal: "left" }, // Default Props
  buttonClassName,
  popoverClassName,
  buttonStyle,
  popoverStyle,
}) {
  const open = Boolean(anchorEl);

  return (
    <View>
      <TouchableOpacity
        onPress={handleClick}
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
          onRequestClose={handleClose}
        >
          <View className="flex-1 justify-center items-center">
            <View
              className={`${popoverClassName} absolute`} // Applying NativeWind class here
              style={{
                ...popoverStyle,
                top: anchorOrigin.vertical === "bottom" ? 100 : undefined,
                left: anchorOrigin.horizontal === "left" ? 10 : undefined,
              }}
            >
              {popoverContent}
            </View>
            <TouchableOpacity
              className="absolute top-0 left-0 w-full h-full"
              onPress={handleClose}
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
  anchorOrigin: PropTypes.shape({
    vertical: PropTypes.oneOf(["top", "center", "bottom"]),
    horizontal: PropTypes.oneOf(["left", "center", "right"]),
  }),
  handleClick: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  buttonId: PropTypes.string,
  buttonClassName: PropTypes.string,
  popoverClassName: PropTypes.string,
  buttonStyle: PropTypes.object,
  popoverStyle: PropTypes.object,
};

export default PopoverComponent;
