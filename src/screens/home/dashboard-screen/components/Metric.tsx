import React from 'react';
import type { ImageSourcePropType } from 'react-native';
import { Box, HStack, Image, Text, VStack } from 'native-base';
import shortid from 'shortid';

const DataPoint = ({
  size = 'sm',
  title,
  measurements,
}: {
  size: 'sm' | 'lg';
  title: string;
  measurements: { value: string; unit?: string }[];
}) => {
  return (
    <HStack space="2">
      <VStack>
        <Text
          fontSize="xs"
          _light={{ color: 'dustyGray.900' }}
          _dark={{ color: 'dustyGray.300' }}
        >
          {title}
        </Text>
        <HStack space="4">
          {measurements.map(measurement => (
            <Text
              key={shortid.generate()}
              fontSize={size === 'lg' ? '2xl' : 'md'}
              fontWeight="bold"
            >
              {measurement.value}
              <Text
                fontSize={size === 'lg' ? 'md' : 'xs'}
                _light={{ color: 'dustyGray.600' }}
                _dark={{ color: 'dustyGray.500' }}
                fontWeight="normal"
              >
                {measurement.unit}
              </Text>
            </Text>
          ))}
        </HStack>
      </VStack>
    </HStack>
  );
};

type MetricProps = {
  imageSource?: ImageSourcePropType;
  title: string;
  dataPoints: {
    title: string;
    measurements: { value: string; unit?: string }[];
  }[];
};

const Metric = ({ imageSource, title, dataPoints }: MetricProps) => {
  return (
    <Box>
      <HStack space="4">
        <VStack justifyContent="space-between" flex="1">
          <HStack alignItems="flex-start" space="2">
            <Image
              resizeMode="contain"
              w="20px"
              h="20px"
              alt="icon"
              source={imageSource}
            />
            <Text
              fontWeight="bold"
              _light={{ color: 'dustyGray.900' }}
              _dark={{ color: 'white' }}
            >
              {title}
            </Text>
          </HStack>
          <DataPoint
            size="lg"
            title={dataPoints[0].title}
            measurements={dataPoints[0].measurements}
          />
        </VStack>
        <Box flex="1">
          <HStack space="2" justifyContent="space-between">
            {dataPoints.map((_, index) => {
              if (index % 2 === 0) {
                return;
              }

              return (
                <VStack key={shortid.generate()} space="2">
                  <DataPoint
                    size="sm"
                    title={dataPoints[index].title}
                    measurements={dataPoints[index].measurements}
                  />
                  <DataPoint
                    size="sm"
                    title={dataPoints[index + 1].title}
                    measurements={dataPoints[index + 1].measurements}
                  />
                </VStack>
              );
            })}
          </HStack>
        </Box>
      </HStack>
    </Box>
  );
};

export default Metric;
