import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#312e38',
  },
  header: {
    padding: 24,
    paddingTop: 48,
    backgroundColor: '#28262e',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  headerTitle: {
    color: '#f4ede8',
    fontSize: 20,
    fontFamily: 'RobotoSlab_400Regular',
    lineHeight: 28,
  },
  userName: {
    color: '#ff9000',
    fontFamily: 'RobotoSlab_500Medium',
  },
  userAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  providersList: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
  },
  providersListTitle: {
    fontSize: 24,
    marginBottom: 24,
    color: '#f4ede8',
    fontFamily: 'RobotoSlab_500Medium',
  },
  providerContainer: {
    backgroundColor: '#3e3b47',
    borderRadius: 10,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  providerInfo: {
    flex: 1,
    marginLeft: 20,
  },
  providerName: {
    fontFamily: 'RobotoSlab_500Medium',
    fontSize: 18,
    color: '#f4ede8',
  },
  providerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  providerMetaText: {
    marginLeft: 8,
    color: '#999591',
    fontFamily: 'RobotoSlab_400Regular',
  },
});
