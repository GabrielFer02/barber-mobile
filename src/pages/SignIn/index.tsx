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

import { useAuth } from '../../hooks/auth';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { styles } from './styles';

import logoImg from '../../assets/logo.png';

interface SignInFormData {
  email: string;
  password: string;
}

const schema = Yup.object().shape({
  email: Yup.string().required('Email obrigatório').email('Digite um e-mail válido'),
  password: Yup.string().required('Senha obrigatória'),
});

const SignIn: React.FC = () => {
  const passwordInputRef = useRef<TextInput>(null);
  const navigation = useNavigation<any>();
  const { signIn } = useAuth();

  const { control, handleSubmit, formState: { errors } } = useForm<SignInFormData>({
    resolver: yupResolver(schema),
  });

  const handleSignIn = useCallback(
    async (data: SignInFormData) => {
      try {
        await signIn({ email: data.email, password: data.password });
      } catch {
        Alert.alert('Erro na autenticação', 'Ocorreu um erro ao fazer login. Cheque suas credenciais');
      }
    },
    [signIn],
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
              <Text style={styles.title}>Faça seu login</Text>
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
                  icon="lock"
                  placeholder="Senha"
                  secureTextEntry
                  returnKeyType="send"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  onSubmitEditing={handleSubmit(handleSignIn)}
                />
              )}
            />

            <Button onPress={handleSubmit(handleSignIn)}>Entrar</Button>

            <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <TouchableOpacity
        style={styles.createAccountButton}
        onPress={() => navigation.navigate('SignUp')}
      >
        <Feather name="log-in" size={20} color="#ff9000" />
        <Text style={styles.createAccountButtonText}>Criar uma conta</Text>
      </TouchableOpacity>
    </>
  );
};

export default SignIn;
