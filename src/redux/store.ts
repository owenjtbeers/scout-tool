// Storage
import ExpoFileSystemStorage from "redux-persist-expo-filesystem";

// Redux
import { persistStore, persistReducer} from "redux-persist";
import { configureStore } from "@reduxjs/toolkit";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

// Root Reducer
import { rootReducer } from "./rootReducer";
import { MAP_DRAWING_REDUCER_KEY } from "./map/drawingSlice";
import { useDispatch } from "react-redux";

// Redux Persist Config
const persistConfig = {
  key: "root",
  storage: ExpoFileSystemStorage,
  blacklist: [MAP_DRAWING_REDUCER_KEY],
  reconcile: autoMergeLevel2,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// EXPORTS
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (gdm) => gdm({ serializableCheck: false }),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const persistor = persistStore(store);
