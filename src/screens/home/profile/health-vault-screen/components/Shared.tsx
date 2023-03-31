import React, { useState } from 'react';
import { Box, HStack, Text, Switch, FlatList, Spinner } from 'native-base';

import SharedDocument from './SharedDocument';
import { useSharingDocuments } from '@hooks/useHealthVault';

const renderSpinner = () => <Spinner color="emerald.500" size="lg" />;

const Shared = () => {
  const [onlyShowActive, setOnlyShowActive] = useState(false);
  const { isLoading, data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useSharingDocuments();

  const loadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  return (
    <Box flex={1}>
      {isLoading ? (
        <Box flex={1} justifyContent="center">
          <Spinner size="lg" />
        </Box>
      ) : (
        <>
          <HStack
            justifyContent="flex-end"
            pt={3}
            pb={5}
            alignItems="center"
            borderBottomWidth="1px"
            borderBottomColor="dustyGray.300"
            space={1}
          >
            <Text>Show active sharing only</Text>
            <Switch
              isChecked={onlyShowActive}
              onToggle={setOnlyShowActive}
              colorScheme="emerald"
            />
          </HStack>
          <FlatList
            data={data?.pages.map(page => page.records).flat()}
            renderItem={({ item }) => <SharedDocument data={item} />}
            onEndReached={loadMore}
            onEndReachedThreshold={0.3}
            ListFooterComponent={isFetchingNextPage ? renderSpinner : null}
          />
        </>
      )}
    </Box>
  );
};

export default Shared;
