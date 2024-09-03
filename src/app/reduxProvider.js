"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "../../store/store";
import dynamic from "next/dynamic";

const PersistGateWrapper = dynamic(
  () => import("redux-persist/integration/react").then(mod => mod.PersistGate),
  { ssr: false }
);

const ReduxProvider = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGateWrapper loading={null} persistor={persistor}>
        {children}
      </PersistGateWrapper>
    </Provider>
  );
};

export default ReduxProvider;
