import React, { useCallback, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View, Alert } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
import { styles } from './styles';

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}

const Dashboard: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const { user, signOut } = useAuth();
  const { navigate } = useNavigation<any>();

  useFocusEffect(
    useCallback(() => {
      api.get('providers').then(response => {
        setProviders(response.data);
      }).catch(() => {
        Alert.alert('Erro', 'Não foi possível carregar os cabeleireiros. Verifique sua conexão com o servidor.');
      });
    }, []),
  );

  const navigateToProfile = useCallback(() => {
    navigate('Profile');
  }, [navigate]);

  const navigateToCreateAppointment = useCallback(
    (providerId: string) => {
      navigate('CreateAppointment', { providerId });
    },
    [navigate],
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={signOut}>
          <Feather name="power" size={20} color="#999591" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Bem vindo,{'\n'}
          <Text style={styles.userName}>{user.name}</Text>
        </Text>

        <TouchableOpacity onPress={navigateToProfile}>
          {user.avatar_url
            ? <Image source={{ uri: user.avatar_url }} style={styles.userAvatar} contentFit="cover" />
            : <View style={[styles.userAvatar, { backgroundColor: '#3e3b47', justifyContent: 'center', alignItems: 'center' }]}>
                <Feather name="user" size={24} color="#999591" />
              </View>
          }
        </TouchableOpacity>
      </View>

      <FlatList
        data={providers}
        keyExtractor={provider => provider.id}
        contentContainerStyle={styles.providersList}
        ListHeaderComponent={
          <Text style={styles.providersListTitle}>Cabeleireiros</Text>
        }
        ListEmptyComponent={
          <Text style={{ color: '#999591', fontFamily: 'RobotoSlab_400Regular', textAlign: 'center', marginTop: 32 }}>
            Nenhum cabeleireiro encontrado
          </Text>
        }
        renderItem={({ item: provider }) => (
          <TouchableOpacity
            style={styles.providerContainer}
            onPress={() => navigateToCreateAppointment(provider.id)}
          >
            {provider.avatar_url
              ? <Image source={{ uri: provider.avatar_url }} style={styles.providerAvatar} contentFit="cover" />
              : <View style={[styles.providerAvatar, { backgroundColor: '#28262e', justifyContent: 'center', alignItems: 'center' }]}>
                  <Feather name="user" size={28} color="#999591" />
                </View>
            }

            <View style={styles.providerInfo}>
              <Text style={styles.providerName}>{provider.name}</Text>

              <View style={styles.providerMeta}>
                <Feather name="calendar" size={14} color="#ff9000" />
                <Text style={styles.providerMetaText}>Segunda à sexta</Text>
              </View>

              <View style={styles.providerMeta}>
                <Feather name="clock" size={14} color="#ff9000" />
                <Text style={styles.providerMetaText}>8h às 18h</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Dashboard;
