import { extendTheme } from 'native-base';

import Button from './button';
import Input from './input';
import Radio from './radio';
import { ModalHeader, ModalBody, ModalFooter } from './modal';

const colors = {
  primary: {
    100: '#CBD2E6',
    200: '#B5BFDB',
    300: '#8A99C6',
    400: '#5E73B1',
    500: '#334D9C',
    600: '#082787',
    700: '#06206F',
    800: '#051957',
    900: '#03123F',
  },
  secondary: {
    100: '#F2F7EE',
    200: '#E6EFDE',
    300: '#CDE0BD',
    400: '#B5D09C',
    500: '#9CC17B',
    600: '#84B25A',
    700: '#698E48',
    800: '#4F6A36',
    900: '#344723',
  },
  tertiary: {
    100: '#CBE3FE',
    200: '#B5D8FE',
    300: '#89C1FD',
    400: '#5DAAFD',
    500: '#3193FC',
    600: '#057CFC',
    700: '#0466CF',
    800: '#0350A3',
    900: '#023A76',
  },
  grape: {
    100: '#DECBE7',
    200: '#D0B5DC',
    300: '#B489C8',
    400: '#985DB4',
    500: '#7C31A0',
    600: '#61068C',
    700: '#4F0473',
    800: '#3E035A',
    900: '#2D0242',
  },
  sanMarino: {
    100: '#D6DFEC',
    200: '#C4D2E4',
    300: '#A2B7D4',
    400: '#7F9CC4',
    500: '#5C81B4',
    600: '#3A67A4',
    700: '#2F5487',
    800: '#25426A',
    900: '#1B304D',
  },
  glacier: {
    100: '#F3F8F9',
    200: '#E7F2F4',
    300: '#CFE5E9',
    400: '#B8D8DE',
    500: '#A0CBD3',
    600: '#89BEC8',
    700: '#6D98A0',
    800: '#527278',
    900: '#364B4F',
  },
  pelorous: {
    100: '#EBF7F8',
    200: '#D8EFF1',
    300: '#B2DFE3',
    400: '#8BD0D5',
    500: '#65C0C7',
    600: '#3FB1B9',
    700: '#328D94',
    800: '#256A6F',
    900: '#194649',
  },
  jazzberry: {
    100: '#F7E7EE',
    200: '#EFD0DE',
    300: '#E0A1BD',
    400: '#D1729D',
    500: '#C2437C',
    600: '#B3155C',
    700: '#8F1049',
    800: '#6B0C37',
    900: '#470824',
  },
  dustyGray: {
    100: '#F4F4F4',
    200: '#EAEAEA',
    300: '#D6D6D6',
    400: '#C1C1C1',
    500: '#ADADAD',
    600: '#999999',
    700: '#7A7A7A',
    800: '#5B5B5B',
    900: '#3D3D3D',
  },
  botticelli: {
    100: '#FAFBFD',
    200: '#F5F8FB',
    300: '#ECF2F7',
    400: '#E3EBF3',
    500: '#DAE5EF',
    600: '#D1DFEA',
    700: '#A7B2BC',
    800: '#7D858D',
    900: '#53595D',
  },
};

const fontConfig = {
  AvenirNext: {
    400: {
      normal: 'AvenirNext-Regular',
      italic: 'AvenirNext-Italic',
    },
    500: {
      normal: 'AvenirNext-Medium',
      italic: 'AvenirNext-MediumItalic',
    },
    700: {
      normal: 'AvenirNext-Bold',
      italic: 'AvenirNext-BoldItalic',
    },
  },
};

const config = {
  colors,
  fontConfig,
  fonts: {
    heading: 'AvenirNext',
    body: 'AvenirNext',
    mono: 'AvenirNext',
  },
  components: {
    Button,
    Input,
    Radio,
    ModalHeader,
    ModalBody,
    ModalFooter,
  },
};

const theme = extendTheme(config);
export default theme;
