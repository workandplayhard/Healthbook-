export default {
  sizes: {
    lg: {
      px: 6,
      py: 3,
      _text: {
        fontSize: 'sm',
      },
    },
    sm: {
      px: 4,
      py: 2,
      _text: {
        fontSize: 'sm',
      },
    },
    xs: {
      px: 3,
      py: 2,
      _text: {
        fontSize: '2xs',
      },
    },
  },
  defaultProps: {
    size: 'lg',
  },
  variants: {
    solid: () => {
      return {
        _text: {
          color: 'coolGray.50',
          fontWeight: 'medium',
          textTransform: 'capitalize',
        },
        _light: {
          bg: 'primary.600',
          _pressed: { bg: 'primary.800' },
        },
        _dark: {
          bg: 'tertiary.600',
          _pressed: { bg: 'tertiary.800' },
        },
      };
    },
    outline: () => {
      return {
        _text: {
          textTransform: 'capitalize',
          fontWeight: 'medium',
        },
        _light: {
          bg: 'coolGray.50',
          _text: {
            color: 'primary.600',
          },
          borderColor: 'primary.600',
          _pressed: { bg: 'coolGray.200' },
        },
        _dark: {
          bg: 'coolGray.800',
          _text: {
            color: 'coolGray.300',
          },
          borderColor: 'coolGray.300',
          _pressed: { bg: 'coolGray.700' },
        },
      };
    },
  },
};
