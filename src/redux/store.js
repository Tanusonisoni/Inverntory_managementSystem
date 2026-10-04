import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import productReducer from "./slices/productSlice";
import categoryReducer from "./slices/categorySlice";
import supplierReducer from "./slices/supplierSlice";
import inventoryReducer from "./slices/invnetorySlice";
import locationReducer from "./slices/locationSlice";
import stockMovementReducer from "./slices/stockMovementSlice";
import purchaseReducer from "./slices/purchaseSlice";
import goodsReceiptReducer from "./slices/goodsReceiptSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    category: categoryReducer,
    supplier: supplierReducer,
    inventory: inventoryReducer,
    location: locationReducer,
    stockMovement: stockMovementReducer,
    purchase: purchaseReducer,
    goodsReceipt: goodsReceiptReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export default store;