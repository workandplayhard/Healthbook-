import {
  Box,
  Button,
  Checkbox,
  IconButton,
  Radio,
  Text,
  VStack,
} from 'native-base';
import React, { ReactNode, useMemo } from 'react';

import BadOnIcon from '@assets/icons/bad-on.svg';
import BadOffIcon from '@assets/icons/bad-off.svg';
import HappyOnIcon from '@assets/icons/happy-on.svg';
import HappyOffIcon from '@assets/icons/happy-off.svg';
import JustOkOnIcon from '@assets/icons/justok-on.svg';
import JustOkOffIcon from '@assets/icons/justok-off.svg';
import { Controller, useFormContext } from 'react-hook-form';
import { ProfileQuestion } from 'services/types';

const CheckboxQuestion = ({
  title,
  value = {},
  onChange,
  options,
}: {
  title: ReactNode;
  value?: { [prop: string]: string };
  options: { [prop: string]: string };
  onChange: (key: string, isSelected: boolean) => void;
}) => {
  return (
    <VStack space={6}>
      {title}
      {Object.keys(options).map(key => (
        <Checkbox
          key={key}
          value={key}
          size="sm"
          isChecked={!!value[key]}
          onChange={isSelected => onChange(key, isSelected)}
        >
          <Text fontSize="lg" lineHeight="lg">
            {options[key]}
          </Text>
        </Checkbox>
      ))}
    </VStack>
  );
};

const YesOrNoQuestion = ({
  title,
  value = {},
  onChange,
}: {
  title: ReactNode;
  value: { [prop: string]: string };
  onChange: (value: { [prop: string]: string }) => void;
}) => {
  return (
    <Box>
      {title}
      <Button.Group mt={2}>
        <Button
          variant={!!value[1] ? 'solid' : 'outline'}
          flex={1}
          colorScheme="primary"
          borderColor="primary.500"
          borderRadius={6}
          borderWidth={2}
          height="12"
          py={0}
          _text={{ fontWeight: 'semibold' }}
          onPress={() => onChange({ '1': 'Yes' })}
        >
          Yes
        </Button>

        <Button
          variant={!!value[2] ? 'solid' : 'outlined'}
          flex={1}
          colorScheme="primary"
          borderColor="primary.500"
          borderRadius={6}
          borderWidth={2}
          height="12"
          py={0}
          _text={{ fontWeight: 'semibold' }}
          onPress={() => onChange({ '2': 'No' })}
        >
          No
        </Button>
      </Button.Group>
    </Box>
  );
};

const EmojisQuestion = ({
  title,
  value = {},
  onChange,
}: {
  title: ReactNode;
  value: { [prop: string]: string };
  onChange: (value: { [prop: string]: string }) => void;
}) => {
  return (
    <Box>
      {title}

      <Button.Group>
        <IconButton
          onPress={() => onChange({ '1': 'Good' })}
          icon={
            !!value[1] ? (
              <HappyOnIcon width="75" height="75" />
            ) : (
              <HappyOffIcon width="75" height="75" />
            )
          }
        />
        <IconButton
          onPress={() => onChange({ '2': 'Ok' })}
          icon={
            !!value[2] ? (
              <JustOkOnIcon width="75" height="75" />
            ) : (
              <JustOkOffIcon width="75" height="75" />
            )
          }
        />
        <IconButton
          onPress={() => onChange({ '3': 'Bad' })}
          icon={
            value[3] ? (
              <BadOnIcon width="75" height="75" />
            ) : (
              <BadOffIcon width="75" height="75" />
            )
          }
        />
      </Button.Group>
    </Box>
  );
};

type PropTypes = {
  questions: ProfileQuestion[];
};

const QuestionnaireForm: React.FC<PropTypes> = ({ questions }) => {
  const { control, getValues } = useFormContext<{
    [prop: string]: any;
  }>();

  const questionsFields = useMemo(() => {
    return questions.map(
      ({ question_id, question_type, question_title, question_options }) => {
        if (question_type === 'checkbox') {
          return (
            <Controller
              key={question_id}
              control={control}
              rules={{ required: true }}
              name={`${question_id}`}
              render={({ field: { value, onChange } }) => {
                return (
                  <CheckboxQuestion
                    title={
                      <Text fontSize="xl" lineHeight="lg" fontWeight="bold">
                        {question_title}
                        <Text color="red.500">*</Text>
                      </Text>
                    }
                    value={value}
                    options={question_options}
                    onChange={(key: string, isSelected) => {
                      const prev = getValues(`${question_id}`) || {};
                      let newValue = { ...prev };

                      if (isSelected) {
                        newValue[key] = question_options[key];
                      } else {
                        delete newValue[key];
                      }

                      onChange(newValue);
                    }}
                  />
                );
              }}
            />
            // <Box key={question_id}></Box>
          );
        }

        if (question_type === 'button') {
          return (
            <Controller
              key={question_id}
              control={control}
              rules={{ required: true }}
              name={`${question_id}`}
              render={({ field: { value, onChange } }) => (
                <YesOrNoQuestion
                  title={
                    <Text fontSize="xl" lineHeight="lg" fontWeight="bold">
                      {question_title}
                      <Text color="red.500">*</Text>
                    </Text>
                  }
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          );
        }

        if (question_type === 'Emojis') {
          return (
            <Controller
              key={question_id}
              control={control}
              rules={{ required: true }}
              name={`${question_id}`}
              render={({ field: { value, onChange } }) => (
                <EmojisQuestion
                  title={
                    <Text fontSize="xl" lineHeight="lg" fontWeight="bold">
                      {question_title}
                      <Text color="red.500">*</Text>
                    </Text>
                  }
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          );
        }

        if (question_type === 'radiobutton') {
          return (
            <Controller
              key={question_id}
              control={control}
              rules={{ required: true }}
              name={`${question_id}`}
              render={({ field: { value = '', onChange } }) => (
                <Radio.Group
                  name={`${question_id}`}
                  mb={4}
                  value={value}
                  onChange={onChange}
                >
                  <VStack space={4}>
                    <Text fontSize="xl" lineHeight="lg" fontWeight="bold">
                      {question_title}
                      <Text color="red.500">*</Text>
                    </Text>
                    {Object.keys(question_options).map(option => (
                      <Radio
                        value={question_options[option]}
                        key={option}
                        size="sm"
                        _text={{ fontSize: 'lg' }}
                      >
                        {question_options[option]}
                      </Radio>
                    ))}
                  </VStack>
                </Radio.Group>
              )}
            />
          );
        }
        return <Box key={question_id}></Box>;
      },
    );
  }, [questions]);

  return (
    <VStack space={4} px={6}>
      {questionsFields}
    </VStack>
  );
};

export default QuestionnaireForm;
