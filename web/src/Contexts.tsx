import { createContext } from 'react';

export type UUIDContextType = {
  uuid: string,
  setUUID: (uuid: string) => void,
};

export const UUIDContext = createContext({
  uuid: '',
  setUUID: (_: string) => {},
});

export const connectUUID = (Component: React.ElementType<UUIDContextType>) => () => (
  <UUIDContext.Consumer>
    {ctx => <Component {...ctx} />}
  </UUIDContext.Consumer>
);
