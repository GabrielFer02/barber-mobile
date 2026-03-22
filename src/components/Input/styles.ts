import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,
    paddingHorizontal: 16,
    backgroundColor: '#232129',
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#232129',
    flexDirection: 'row',
    alignItems: 'center',
  },
  focused: {
    borderColor: '#ff9000',
  },
  errored: {
    borderColor: '#c53030',
  },
  textInput: {
    flex: 1,
    color: '#f4ede8',
    fontSize: 16,
    fontFamily: 'RobotoSlab_400Regular',
  },
  icon: {
    marginRight: 16,
  },
});
