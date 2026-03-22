import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';
import { styles } from './styles';

interface ButtonProps extends TouchableOpacityProps {
  children: string;
}

const Button: React.FC<ButtonProps> = ({ children, ...rest }) => (
  <TouchableOpacity activeOpacity={0.8} style={styles.container} {...rest}>
    <Text style={styles.text}>{children}</Text>
  </TouchableOpacity>
);

export default Button;
