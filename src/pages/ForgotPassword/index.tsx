import React, { useCallback } from 'react';
import {
  Image,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import api from '../../services/api';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { styles } from './styles';

import logoImg from '../../assets/logo.png';

interface ForgotPasswordFormData {
  email: string;
}

const schema = Yup.object().shape({
  email: Yup.string().required('Email obrigatório').email('Digite um e-mail válido'),
});

const ForgotPassword: React.FC = () => {
  const navigation = useNavigation<any>();

  const { control, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(schema),
  });

  const handleForgotPassword = useCallback(async (data: ForgotPasswordFormData) => {
    try {
      await api.post('/password/forgot', { email: data.email });
      Alert.alert(
        'E-mail de recuperação enviado',
        'Enviamos um e-mail para confirmar a recuperação de senha. Verifique sua caixa de entrada.',
      );
      navigation.goBack();
    } catch {
      Alert.alert('Erro', 'Ocorreu um erro ao tentar recuperar a senha. Tente novamente.');
    }
  }, [navigation]);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flex: 1 }}>
          <View style={styles.container}>
            <Image source={logoImg} />

            <View>
              <Text style={styles.title}>Recuperar senha</Text>
            </View>

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Input
                  ref={ref as any}
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  icon="mail"
                  placeholder="E-mail"
                  returnKeyType="send"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  onSubmitEditing={handleSubmit(handleForgotPassword)}
                />
              )}
            />

            <Button onPress={handleSubmit(handleForgotPassword)}>Recuperar</Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <TouchableOpacity style={styles.backToSignIn} onPress={() => navigation.goBack()}>
        <Feather name="arrow-left" size={20} color="#fff" />
        <Text style={styles.backToSignInText}>Voltar para login</Text>
      </TouchableOpacity>
    </>
  );
};

export default ForgotPassword;
