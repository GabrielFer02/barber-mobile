import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 30,
    paddingBottom: Platform.OS === 'android' ? 150 : 40,
    backgroundColor: '#312e38',
  },
  title: {
    fontSize: 20,
    color: '#f4ede8',
    fontFamily: 'RobotoSlab_500Medium',
    marginTop: 24,
    marginBottom: 24,
  },
  backButton: {
    marginTop: 40,
  },
  userAvatarButton: {
    marginTop: 32,
    alignSelf: 'center',
  },
  userAvatar: {
    width: 186,
    height: 186,
    borderRadius: 93,
  },
});
