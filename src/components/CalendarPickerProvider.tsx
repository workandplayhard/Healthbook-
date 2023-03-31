import React, {
  createContext,
  type PropsWithChildren,
  useState,
  useRef,
} from 'react';
import CalendarPicker from 'react-native-calendar-picker';
import { Modal, useColorMode } from 'native-base';
import { TextStyle, ViewStyle } from 'react-native';
import dayjs from 'dayjs';
import theme from '@theme';

type CalendarProps = {
  onDateChange?: (date: any, type: string) => void;
  initialDate?: any;
  previousTitleStyle?: TextStyle;
  nextTitleStyle?: TextStyle;
  textStyle?: TextStyle;
  todayBackgroundColor?: string;
  todayTextStyle?: TextStyle;
  customDatesStyles?: { date: Date; style: ViewStyle; textStyle: TextStyle }[];
  _dark?: CalendarProps;
};

type CalendarPickerContextValue = {
  openCalendar: (options: {
    calendarProps?: CalendarProps;
    value: string;
    onChange: (date: string) => void;
  }) => void;
  closeCalendar: () => void;
};

type CalendarPickerProviderProps = {
  defaultCalendarProps?: CalendarProps;
};

export const CalendarPickerContext = createContext<CalendarPickerContextValue>({
  openCalendar: () => {},
  closeCalendar: () => {},
});

const CalendarPickerProvider: React.FC<
  PropsWithChildren<CalendarPickerProviderProps>
> = ({ children, defaultCalendarProps = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const calendarPropsRef = useRef<CalendarProps>(defaultCalendarProps);
  const { colorMode } = useColorMode();

  const openCalendar = ({
    calendarProps = {},
    value,
    onChange,
  }: {
    calendarProps?: CalendarProps;
    value: string;
    onChange: (date: string) => void;
  }) => {
    const initialDate =
      !value || !dayjs(value, 'MM/DD/YYYY').isValid()
        ? new Date()
        : dayjs(value, 'MM/DD/YYYY').toDate();

    calendarPropsRef.current = {
      ...defaultCalendarProps,
      ...calendarProps,
      onDateChange: date => {
        onChange(date.format('MM/DD/YYYY'));
        closeCalendar();
      },
      initialDate,
      customDatesStyles: [
        {
          date: initialDate,
          style: { backgroundColor: theme.colors.primary[600] },
          textStyle: { color: 'white' },
        },
      ],
    };
    setIsOpen(true);
  };

  const closeCalendar = () => setIsOpen(false);

  const calendarPropsOnColorMode =
    colorMode === 'light'
      ? { ...calendarPropsRef.current }
      : { ...calendarPropsRef.current, ...calendarPropsRef.current._dark };

  return (
    <CalendarPickerContext.Provider value={{ openCalendar, closeCalendar }}>
      {children}
      <Modal isOpen={isOpen} onClose={closeCalendar}>
        <Modal.Content p={5} width="full">
          <CalendarPicker {...calendarPropsOnColorMode} />
        </Modal.Content>
      </Modal>
    </CalendarPickerContext.Provider>
  );
};

export default CalendarPickerProvider;
