import React, { useContext } from 'react';
import { CalendarPickerContext } from 'components/CalendarPickerProvider';

export const useCalendarPicker = () => useContext(CalendarPickerContext);
