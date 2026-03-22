import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#312e38',
  },
  title: {
    fontSize: 32,
    color: '#f4ede8',
    fontFamily: 'RobotoSlab_500Medium',
    marginTop: 48,
    textAlign: 'center',
  },
  description: {
    fontFamily: 'RobotoSlab_400Regular',
    fontSize: 18,
    color: '#999591',
    marginTop: 16,
    textAlign: 'center',
  },
  okButton: {
    backgroundColor: '#ff9000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  okButtonText: {
    fontFamily: 'RobotoSlab_500Medium',
    color: '#312e38',
    fontSize: 18,
  },
});
