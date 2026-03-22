import React, { useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { styles } from './styles';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const schema = Yup.object().shape({
  name: Yup.string().required('Nome obrigatório'),
  email: Yup.string().required('Email obrigatório').email('Digite um e-mail válido'),
  old_password: Yup.string(),
  password: Yup.string().when('old_password', {
    is: (val: string) => !!val?.length,
    then: schema => schema.min(6).required('Campo obrigatório'),
    otherwise: schema => schema,
  }),
  password_confirmation: Yup.string()
    .when('old_password', {
      is: (val: string) => !!val?.length,
      then: schema => schema.min(6).required('Campo obrigatório'),
      otherwise: schema => schema,
    })
    .oneOf([Yup.ref('password')], 'Confirmação incorreta'),
});

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigation = useNavigation<any>();

  const emailInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const passwordConfirmationInputRef = useRef<TextInput>(null);

  const { control, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: user.name,
      email: user.email,
      old_password: '',
      password: '',
      password_confirmation: '',
    },
  });

  const handleUpdateProfile = useCallback(
    async (data: ProfileFormData) => {
      try {
        const { name, email, old_password, password, password_confirmation } = data;
        const formData = {
          name,
          email,
          ...(old_password ? { old_password, password, password_confirmation } : {}),
        };
        const response = await api.put('profile', formData);
        updateUser(response.data);
        Alert.alert('Perfil atualizado com sucesso!');
        navigation.goBack();
      } catch {
        Alert.alert('Erro na atualização do perfil', 'Ocorreu um erro ao atualizar o seu perfil, tente novamente.');
      }
    },
    [navigation, updateUser],
  );

  const handleUpdateAvatar = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (result.canceled) return;

    try {
      const uploadResult = await FileSystem.uploadAsync(
        `${api.defaults.baseURL}/users/avatar`,
        result.assets[0].uri,
        {
          httpMethod: 'PATCH',
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: 'avatar',
          mimeType: 'image/jpeg',
          headers: {
            Authorization: String((api.defaults.headers as any).authorization ?? ''),
          },
        },
      );

      if (uploadResult.status !== 200) {
        Alert.alert('Erro', 'Não foi possível atualizar o avatar. Tente novamente.');
        return;
      }

      const responseData = JSON.parse(uploadResult.body);
      if (responseData.avatar && !responseData.avatar_url) {
        responseData.avatar_url = `${api.defaults.baseURL}/files/${responseData.avatar}`;
      }
      updateUser(responseData);
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar o avatar. Tente novamente.');
    }
  }, [updateUser, user.id]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled
    >
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" size={24} color="#999591" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.userAvatarButton} onPress={handleUpdateAvatar}>
            {user.avatar_url
              ? <Image key={user.avatar_url} source={{ uri: user.avatar_url }} style={styles.userAvatar} contentFit="cover" />
              : <View style={[styles.userAvatar, { backgroundColor: '#3e3b47', justifyContent: 'center', alignItems: 'center' }]}>
                  <Feather name="user" size={86} color="#999591" />
                </View>
            }
          </TouchableOpacity>

          <Text style={styles.title}>Meu perfil</Text>

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
                onSubmitEditing={() => oldPasswordInputRef.current?.focus()}
              />
            )}
          />

          <Controller
            control={control}
            name="old_password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                ref={oldPasswordInputRef}
                secureTextEntry
                icon="lock"
                placeholder="Senha atual"
                textContentType="newPassword"
                returnKeyType="next"
                containerStyle={{ marginTop: 16 }}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.old_password?.message}
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
                placeholder="Nova senha"
                textContentType="newPassword"
                returnKeyType="next"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                onSubmitEditing={() => passwordConfirmationInputRef.current?.focus()}
              />
            )}
          />

          <Controller
            control={control}
            name="password_confirmation"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                ref={passwordConfirmationInputRef}
                secureTextEntry
                icon="lock"
                placeholder="Confirmar nova senha"
                textContentType="newPassword"
                returnKeyType="send"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password_confirmation?.message}
                onSubmitEditing={handleSubmit(handleUpdateProfile)}
              />
            )}
          />

          <Button onPress={handleSubmit(handleUpdateProfile)}>Salvar alterações</Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Profile;
