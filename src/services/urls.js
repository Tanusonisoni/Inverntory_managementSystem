import { deleteUser, getAllUsers } from "./userApi";

export const Urls = {
    login: "/auth/login",

    users: "/users",
    getAllUsers:"/users/alluser",
    updateUser:"/users",
    deleteUser:"/users/deleteUser",

    // Product
    registerProduct: "/product/registerPro",
    allProducts: "/product/getproduct",
    productQR: "/product/qr",
    productById: "/product/getProductById",
    updateProduct: "/product/updatepro",
    deleteProduct: "/product/deletePro",
    productsByCategory: "/product/proCategory",

    categories: "/category",
    addCategory: "/category/proCategory",
    allCategories: "/category/allCategory",
    updateCategory: "/category/updateCategory",
    deleteCategory: "/category/deleteCategory",


    supplier: "/supllier/getSupllier",
    addSupplier: "/supllier/supllierReg",
    updateSupplier: "/supllier",
    deleteSupplier: "/supllier/deleteSup",
    getSupplierById: "/supllier/getsupplier",

    purchases: "/purchase",
    
    goodsReceipt: "/goods-recipt",
    inventory: "/inventory",
    locations: "/location",
    stockMovement: "/stock",
    stock: "/stock"
};