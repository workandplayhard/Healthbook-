import * as React from 'react';

export const useStateWithCallback = (initialState: any, callback: any) => {
  const [state, setState] = React.useState(initialState);

  const didMount = React.useRef(false);

  React.useEffect(() => {
    if (didMount.current) {
      callback(state);
    } else {
      didMount.current = true;
    }
  }, [state, callback]);

  return [state, setState];
};
