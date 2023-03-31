import React, { useState, useEffect } from 'react';
import { Button, View, Pressable, Box, HStack, Text, Link, useColorMode } from 'native-base';

import { Animated, StyleSheet, useWindowDimensions, FlatList } from 'react-native';

import { useCardAnimation } from '@react-navigation/stack';
import { useGenerateSharedRecordPDF } from 'hooks/useHealthRecord';

import { RootStackScreenProps } from 'navigation/types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RecordData } from './data/data';

export const ExportPDFScreen: React.FC<RootStackScreenProps<'ExportPDF'>> = ({ navigation }) => {
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isSelected, setIsSelected] = useState(true);
  const [products, setProducts] = useState(RecordData);

  const { height } = useWindowDimensions();
  const { current } = useCardAnimation();

  const { mutate: generateSharedRecordPDF, isLoading: loader } = useGenerateSharedRecordPDF();

  const handleExportPDF = () => {
    let selectedValues: string[] = [];
    products.map(item => {
      if (item.isChecked) {
        selectedValues.push(item.value);
      }
    });
    const payloadData = {
      hr_types: selectedValues,
    };
    generateSharedRecordPDF(payloadData, {
      onSuccess: response => {
        if (response) {
          // Need to implement pdf sharing code on getting pdf link in the response
        }
      },
    });
  };

  const handleChange = (id: string) => {
    let temp = products.map((product, index) => {
      if (id === product.id) {
        return { ...product, isChecked: !product.isChecked };
      }
      return product;
    });
    setProducts(temp);
  };

  const handleSelectAll = () => {
    if (isCheckAll) {
      let tempArray: any = [];
      products.map(item => {
        tempArray.push({
          label: item.label,
          value: item.value,
          id: item.id,
          isChecked: isCheckAll,
        });
      });
      setProducts(tempArray);
    } else {
      let tempArray: any = [];
      products.map(item => {
        tempArray.push({
          label: item.label,
          value: item.value,
          id: item.id,
          isChecked: isCheckAll,
        });
      });
      setProducts(tempArray);
    }
  };
  const selectAll = () => {
    setIsCheckAll(!isCheckAll);
  };
  const { colorMode } = useColorMode();

  useEffect(() => {
    handleSelectAll();
  }, [isCheckAll]);

  useEffect(() => {
    const tempArray = products.filter(item => item.isChecked);
    if (tempArray.length > 0) {
      setIsSelected(false);
    } else {
      setIsSelected(true);
    }
  }, [handleChange]);
  return (
    <Box flex={1} alignItems="center" justifyContent="center">
      <Pressable
        style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}
        onPress={navigation.goBack}
      />
      <Animated.View
        style={[
          {
            height: height,
            transform: [
              {
                translateY: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [height, height * 0.098],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
          { width: '100%' },
        ]}
      >
        <Box
          flex={1}
          p={4}
          borderRadius={16}
          _dark={{ backgroundColor: 'coolGray.800' }}
          _light={{ backgroundColor: 'white' }}
        >
          <Link
            onPress={() => {
              navigation.goBack();
            }}
            py={5}
          >
            <Text
              _light={{ color: 'primary.600' }}
              _dark={{ color: 'tertiary.600' }}
              fontWeight={700}
              fontSize="sm"
              color="primary.600"
            >
              Close
            </Text>
          </Link>

          <Text
            _light={{ color: 'dustyGray.900' }}
            _dark={{ color: 'white' }}
            fontWeight={500}
            fontSize="sm"
            paddingLeft="9px"
          >
            Select which type of record you'd like to export
          </Text>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={products}
            ListHeaderComponent={
              <View
                paddingBottom={5}
                paddingTop="15px"
                paddingLeft="6px"
                flexDirection="row"
                justifyContent="space-between"
              >
                <HStack>
                  <Pressable onPress={selectAll}>
                    <MaterialCommunityIcons
                      name={isCheckAll ? 'checkbox-marked' : 'checkbox-blank-outline'}
                      size={22}
                      color={
                        colorMode === 'dark' && isCheckAll
                          ? '#057CFC'
                          : colorMode === 'dark' && !isCheckAll
                          ? '#6B7280'
                          : colorMode === 'light' && !isCheckAll
                          ? '#D1D5DB'
                          : '#082787'
                      }
                    />
                  </Pressable>
                  <Text paddingLeft={2} fontWeight="medium" fontSize="sm">
                    {'Select All'}
                  </Text>
                </HStack>
              </View>
            }
            renderItem={({ item }) => (
              <Box>
                <View paddingBottom={5} paddingLeft="6px" flexDirection="row" justifyContent="space-between">
                  <HStack>
                    <Pressable onPress={() => handleChange(item.id)}>
                      <MaterialCommunityIcons
                        name={item.isChecked ? 'checkbox-marked' : 'checkbox-blank-outline'}
                        size={22}
                        color={
                          colorMode === 'dark' && item.isChecked
                            ? '#057CFC'
                            : colorMode === 'dark' && !item.isChecked
                            ? '#6B7280'
                            : colorMode === 'light' && !item.isChecked
                            ? '#D1D5DB'
                            : '#082787'
                        }
                      />
                    </Pressable>
                    <Text paddingLeft={2} fontWeight="medium" fontSize="sm">
                      {item.label}
                    </Text>
                  </HStack>
                </View>
              </Box>
            )}
          />
          <Button
            marginBottom={110}
            isLoading={loader}
            variant="solid"
            size="lg"
            disabled={isSelected}
            onPress={handleExportPDF}
            _light={{ backgroundColor: isSelected ? 'primary.200' : 'primary.600' }}
            _dark={{ backgroundColor: isSelected ? 'tertiary.800' : 'tertiary.600' }}
          >
            <Text
              _dark={{ color: 'coolGray.800' }}
              _light={{ color: 'dustyGray.100' }}
              fontSize="sm"
              fontWeight="medium"
              color="white"
            >
              Export PDF
            </Text>
          </Button>
        </Box>
      </Animated.View>
    </Box>
  );
};
export default ExportPDFScreen;
