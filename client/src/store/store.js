import{configureStore} from "@reduxjs/toolkit"
import authSlice from "./slices/authSlice"

const store = configureStore({
    reducer: {
      auth: authSlice, // Add your reducers here
    },
  });

  export default store;
