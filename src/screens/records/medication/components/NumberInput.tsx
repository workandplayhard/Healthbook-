import {
  AddIcon,
  HStack,
  IconButton,
  IInputProps,
  Input,
  MinusIcon,
} from 'native-base';

type NumberInputProps = IInputProps & {
  value: string;
  onChange: (value: string) => void;
};

const NumberInput: React.FC<NumberInputProps> = ({
  value = '0',
  onChange,
  ...props
}) => {
  return (
    <HStack alignItems="center" space="3.5">
      <IconButton
        width="9"
        height="9"
        borderRadius="full"
        bgColor="dustyGray.500"
        icon={<MinusIcon />}
        _icon={{ color: 'white' }}
        onPress={() => {
          onChange((Number(value) - 1).toString());
        }}
      ></IconButton>

      <Input
        width="12"
        fontSize="sm"
        textAlign="center"
        value={value}
        onChange={onChange}
      />

      <IconButton
        width="9"
        height="9"
        borderRadius="full"
        bgColor="dustyGray.500"
        icon={<AddIcon />}
        _icon={{ color: 'white' }}
        onPress={() => {
          onChange((Number(value) + 1).toString());
        }}
      />
    </HStack>
  );
};

export default NumberInput;
