import {configureStore} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import appReducer from "./slices/appSlice";
import patientReducer from "./slices/patientSlice";
import modalReducer from "./slices/modalSlice";
import permissionsReducer from "./slices/permissionsSlice";

export const store = configureStore({
    reducer: {
        app: appReducer,
        patient: patientReducer,
        modal: modalReducer,
        permissions: permissionsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
