import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    paddingBottom: Platform.OS === 'android' ? 150 : 40,
    backgroundColor: '#312e38',
  },
  title: {
    fontSize: 24,
    color: '#f4ede8',
    fontFamily: 'RobotoSlab_500Medium',
    marginTop: 64,
    marginBottom: 24,
  },
  backToSignInButton: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: '#312e38',
    borderTopWidth: 1,
    borderColor: '#232129',
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  backToSignInButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'RobotoSlab_400Regular',
    marginLeft: 16,
  },
});
