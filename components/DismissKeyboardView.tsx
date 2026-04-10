import React from 'react';
import { Keyboard, TouchableWithoutFeedback, ViewStyle } from 'react-native';

type DismissKeyboardViewProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export function DismissKeyboardView({ children }: DismissKeyboardViewProps) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {children}
    </TouchableWithoutFeedback>
  );
}
