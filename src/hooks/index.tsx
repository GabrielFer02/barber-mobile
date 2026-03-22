import React from 'react';
import { AuthProvider } from './auth';

const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
);

export default AppProvider;
