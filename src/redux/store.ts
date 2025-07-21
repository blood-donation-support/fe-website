import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage
import searchReducer from "./slices/searchSlice";
import customerReducer from "./slices/customerSlice";
import reviewReducer from "./slices/reviewSlice";
import staffListReducer from "./slices/staffListSlice";
import bloodUnitsReducer from "./slices/bloodUnitsSlice";
import donationReducer from "./slices/donationSlice";
import bestBloodTypeReducer from "./slices/bestBloodTypeSlice";
import bestStaffReducer from "./slices/bestStaffSlice";
import userReducer from "./slices/userSlice";
import staffReducer from "./slices/staffSlice";
import customerListReducer from "./slices/customerListSlice";
import donationRegistrationReducer from "./slices/donationRegistrationSlice";
import blogReducer from "./slices/blogSlice"; // Import blog reducer
// import other reducers...

// const persistConfig = {
// 	key: "root",
// 	storage,
// 	whitelist: ["staffList"],
// };
const persistConfig = {
	key: "staffList",
	storage,
};
const persistedStaffListReducer = persistReducer(
	persistConfig,
	staffListReducer,
);

export const store = configureStore({
	reducer: {
		search: searchReducer,
		customer: customerReducer,
		review: reviewReducer,
		staffList: persistedStaffListReducer, 
		customerList: customerListReducer,
		donationRegistration: donationRegistrationReducer,
		blog: blogReducer,
		bloodUnits: bloodUnitsReducer,
		donations: donationReducer,
		bestBloodType: bestBloodTypeReducer,
		bestStaff: bestStaffReducer,
		users: userReducer,
		staff: staffReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
