import React from 'react';
import { View, StatusBar, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  useFonts,
  RobotoSlab_400Regular,
  RobotoSlab_500Medium,
} from '@expo-google-fonts/roboto-slab';

import AppProvider from './src/hooks';
import Routes from './src/routes';

export default function App() {
  const [fontsLoaded, fontError] = useFonts({ RobotoSlab_400Regular, RobotoSlab_500Medium });

  if (!fontsLoaded && !fontError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#312e38' }}>
        <ActivityIndicator color="#ff9000" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor="#312e38" translucent />
        <AppProvider>
          <View style={{ flex: 1, backgroundColor: '#312e38' }}>
            <Routes />
          </View>
        </AppProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
