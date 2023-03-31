import type { ColorMode } from 'native-base';
import theme from 'theme';

export const screenOptions = (colorMode: ColorMode) => {
  return {
    headerBackTitleVisible: false,
    // headerTitleAlign: 'left',
    headerShadowVisible: false,
    headerTintColor: theme.colors.coolGray[50],
    headerStyle: {
      backgroundColor: colorMode === 'dark' ? theme.colors.coolGray[900] : theme.colors.primary[600],
    },
  };
};
