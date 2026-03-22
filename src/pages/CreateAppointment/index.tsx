import React, { useCallback, useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';
import { styles } from './styles';

interface RouteParams {
  providerId: string;
}

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}

interface AvailabilityItem {
  hour: number;
  available: boolean;
}

const CreateAppointment: React.FC = () => {
  const { user } = useAuth();
  const route = useRoute();
  const { goBack, navigate } = useNavigation<any>();
  const routeParams = route.params as RouteParams;

  const [availability, setAvailability] = useState<AvailabilityItem[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(0);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState(routeParams.providerId);

  useEffect(() => {
    api.get('providers').then(response => setProviders(response.data));
  }, []);

  useEffect(() => {
    api
      .get(`providers/${selectedProvider}/day-availability`, {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(response => setAvailability(response.data));
  }, [selectedDate, selectedProvider]);

  const handleDateChanged = useCallback((_: any, date: Date | undefined) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (date) setSelectedDate(date);
  }, []);

  const handleCreateAppointment = useCallback(async () => {
    if (!selectedHour) {
      Alert.alert('Selecione um horário', 'Por favor, escolha um horário disponível antes de agendar.');
      return;
    }

    try {
      const date = new Date(selectedDate);
      date.setHours(selectedHour);
      date.setMinutes(0);
      await api.post('appointments', { provider_id: selectedProvider, date });
      navigate('AppointmentCreated', { date: date.getTime() });
    } catch {
      Alert.alert('Erro ao criar agendamento', 'Ocorreu um erro ao tentar criar o agendamento, tente novamente.');
    }
  }, [navigate, selectedDate, selectedHour, selectedProvider]);

  const morningAvailability = useMemo(() =>
    availability
      .filter(({ hour }) => hour < 12)
      .map(({ hour, available }) => ({
        hour,
        hourFormatted: format(new Date().setHours(hour), 'HH:00'),
        available,
      })),
    [availability],
  );

  const afternoonAvailability = useMemo(() =>
    availability
      .filter(({ hour }) => hour >= 12)
      .map(({ hour, available }) => ({
        hour,
        hourFormatted: format(new Date().setHours(hour), 'HH:00'),
        available,
      })),
    [availability],
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <Feather name="chevron-left" size={24} color="#999591" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cabeleireiros</Text>
        {user.avatar_url
          ? <Image source={{ uri: user.avatar_url }} style={styles.userAvatar} contentFit="cover" />
          : <View style={[styles.userAvatar, { backgroundColor: '#3e3b47', justifyContent: 'center', alignItems: 'center' }]}>
              <Feather name="user" size={24} color="#999591" />
            </View>
        }
      </View>

      <ScrollView>
        <View style={styles.providersListContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.providersList}
            data={providers}
            keyExtractor={provider => provider.id}
            renderItem={({ item: provider }) => (
              <TouchableOpacity
                style={[
                  styles.providerContainer,
                  provider.id === selectedProvider
                    ? styles.providerContainerSelected
                    : styles.providerContainerDefault,
                ]}
                onPress={() => setSelectedProvider(provider.id)}
              >
                {provider.avatar_url
                  ? <Image source={{ uri: provider.avatar_url }} style={styles.providerAvatar} contentFit="cover" />
                  : <View style={[styles.providerAvatar, { backgroundColor: '#28262e', justifyContent: 'center', alignItems: 'center' }]}>
                      <Feather name="user" size={16} color="#999591" />
                    </View>
                }
                <Text
                  style={[
                    styles.providerName,
                    provider.id === selectedProvider
                      ? styles.providerNameSelected
                      : styles.providerNameDefault,
                  ]}
                >
                  {provider.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={styles.calendar}>
          <Text style={styles.title}>Escolha a data</Text>
          <TouchableOpacity
            style={styles.openDatePickerButton}
            onPress={() => setShowDatePicker(s => !s)}
          >
            <Text style={styles.openDatePickerButtonText}>Selecionar outra data</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              mode="date"
              display="calendar"
              onChange={handleDateChanged}
              value={selectedDate}
            />
          )}
        </View>

        <View style={styles.schedule}>
          <Text style={styles.title}>Escolha o horário</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Manhã</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sectionContent}>
              {morningAvailability.map(({ hourFormatted, hour, available }) => (
                <TouchableOpacity
                  key={hourFormatted}
                  disabled={!available}
                  style={[
                    styles.hour,
                    selectedHour === hour ? styles.hourSelected : styles.hourDefault,
                    !available && styles.hourUnavailable,
                  ]}
                  onPress={() => setSelectedHour(hour)}
                >
                  <Text style={[styles.hourText, selectedHour === hour ? styles.hourTextSelected : styles.hourTextDefault]}>
                    {hourFormatted}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tarde</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sectionContent}>
              {afternoonAvailability.map(({ hourFormatted, hour, available }) => (
                <TouchableOpacity
                  key={hourFormatted}
                  disabled={!available}
                  style={[
                    styles.hour,
                    selectedHour === hour ? styles.hourSelected : styles.hourDefault,
                    !available && styles.hourUnavailable,
                  ]}
                  onPress={() => setSelectedHour(hour)}
                >
                  <Text style={[styles.hourText, selectedHour === hour ? styles.hourTextSelected : styles.hourTextDefault]}>
                    {hourFormatted}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        <TouchableOpacity style={styles.createAppointmentButton} onPress={handleCreateAppointment}>
          <Text style={styles.createAppointmentButtonText}>Agendar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default CreateAppointment;
