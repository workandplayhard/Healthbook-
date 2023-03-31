import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import duration from 'dayjs/plugin/duration';
import { NativeBaseProvider, StatusBar } from 'native-base';
import Validic from 'Validic';

import './axios-client-interceptors';
import './localization/i18n';
import CalendarPickerProvider from '@components/CalendarPickerProvider';
import RootNavigator from '@navigation/RootNavigator';
import theme from '@theme';

// Enable dayjs custom parse format
dayjs.extend(duration);
dayjs.extend(customParseFormat);

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: Infinity } },
});

const primaryColor = theme.colors.primary[600];
const darkPrimaryColor = theme.colors.tertiary[600];

const defaultCalendarProps = {
  previousTitleStyle: {
    color: primaryColor,
  },
  nextTitleStyle: {
    color: primaryColor,
  },
  todayBackgroundColor: darkPrimaryColor,
  todayTextStyle: {
    color: 'white',
  },
  _dark: {
    previousTitleStyle: {
      color: darkPrimaryColor,
    },
    nextTitleStyle: {
      color: darkPrimaryColor,
    },
    textStyle: {
      color: 'white',
    },
  },
};

// Enable dev tools for react query in flipper
if (__DEV__) {
  import('react-query-native-devtools').then(({ addPlugin }) => {
    addPlugin({ queryClient });
  });
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NativeBaseProvider theme={theme}>
        <CalendarPickerProvider defaultCalendarProps={defaultCalendarProps}>
          <StatusBar barStyle="light-content" />
          <RootNavigator />
        </CalendarPickerProvider>
      </NativeBaseProvider>
      <Validic />
    </QueryClientProvider>
  );
}

export default App;
