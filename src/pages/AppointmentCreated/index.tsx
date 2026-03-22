import React, { useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from './styles';

interface RouteParams {
  date: number;
}

const AppointmentCreated: React.FC = () => {
  const { reset } = useNavigation<any>();
  const { params } = useRoute();
  const routeParams = params as RouteParams;

  const handleOkPressed = useCallback(() => {
    reset({ routes: [{ name: 'Dashboard' }], index: 0 });
  }, [reset]);

  const formattedDate = useMemo(() => {
    return format(
      routeParams.date,
      "EEEE', dia' dd 'de' MMMM 'de' yyyy 'às' HH:mm",
      { locale: ptBR },
    );
  }, [routeParams.date]);

  return (
    <View style={styles.container}>
      <Feather name="check" size={80} color="#04d361" />
      <Text style={styles.title}>Agendamento concluído</Text>
      <Text style={styles.description}>{formattedDate}</Text>
      <TouchableOpacity style={styles.okButton} onPress={handleOkPressed}>
        <Text style={styles.okButtonText}>Ok</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AppointmentCreated;
