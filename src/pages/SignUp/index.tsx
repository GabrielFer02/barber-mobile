import React, { useRef, useCallback } from 'react';
import {
  Image,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
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

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const schema = Yup.object().shape({
  name: Yup.string().required('Nome obrigatório'),
  email: Yup.string().required('Email obrigatório').email('Digite um e-mail válido'),
  password: Yup.string().min(6, 'Mínimo 6 dígitos'),
});

const SignUp: React.FC = () => {
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const navigation = useNavigation<any>();

  const { control, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
    resolver: yupResolver(schema),
  });

  const handleSignUp = useCallback(
    async (data: SignUpFormData) => {
      try {
        await api.post('users', data);
        Alert.alert('Cadastro realizado com sucesso!', 'Você já pode fazer login na aplicação');
        navigation.goBack();
      } catch {
        Alert.alert('Erro no cadastro', 'Ocorreu um erro ao fazer o cadastro');
      }
    },
    [navigation],
  );

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
              <Text style={styles.title}>Crie sua conta</Text>
            </View>

            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  autoCapitalize="words"
                  icon="user"
                  placeholder="Nome"
                  returnKeyType="next"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.name?.message}
                  onSubmitEditing={() => emailInputRef.current?.focus()}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  ref={emailInputRef}
                  keyboardType="email-address"
                  autoCorrect={false}
                  autoCapitalize="none"
                  icon="mail"
                  placeholder="E-mail"
                  returnKeyType="next"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  onSubmitEditing={() => passwordInputRef.current?.focus()}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  ref={passwordInputRef}
                  secureTextEntry
                  icon="lock"
                  placeholder="Senha"
                  textContentType="newPassword"
                  returnKeyType="send"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  onSubmitEditing={handleSubmit(handleSignUp)}
                />
              )}
            />

            <Button onPress={handleSubmit(handleSignUp)}>Cadastrar</Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <TouchableOpacity
        style={styles.backToSignInButton}
        onPress={() => navigation.goBack()}
      >
        <Feather name="arrow-left" size={20} color="#fff" />
        <Text style={styles.backToSignInButtonText}>Voltar para login</Text>
      </TouchableOpacity>
    </>
  );
};

export default SignUp;
