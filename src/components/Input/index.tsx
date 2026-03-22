import React, { forwardRef, useState, useCallback } from 'react';
import { TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from './styles';

interface InputProps extends TextInputProps {
  icon: string;
  error?: string;
  containerStyle?: ViewStyle;
}

const Input = forwardRef<TextInput, InputProps>(
  ({ icon, error, containerStyle, onFocus, onBlur, value, ...rest }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = useCallback(
      (e: any) => {
        setIsFocused(true);
        onFocus?.(e);
      },
      [onFocus],
    );

    const handleBlur = useCallback(
      (e: any) => {
        setIsFocused(false);
        onBlur?.(e);
      },
      [onBlur],
    );

    const isFilled = !!value;
    const iconColor = isFocused || isFilled ? '#ff9000' : '#666360';

    return (
      <View
        style={[
          styles.container,
          isFocused && styles.focused,
          !!error && styles.errored,
          containerStyle,
        ]}
      >
        <Feather name={icon as any} size={20} color={iconColor} style={styles.icon} />
        <TextInput
          ref={ref}
          style={styles.textInput}
          placeholderTextColor="#666360"
          keyboardAppearance="dark"
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
      </View>
    );
  },
);

export default Input;
