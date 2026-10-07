import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { fetchCategories } from "../redux/slices/categorySlice";
import { fetchProductById, fetchProducts, createProduct, editProduct, removeProduct } from "../redux/slices/productSlice";
import { getProductQrCode } from "../services/productapi";

const emptyForm = {
    name: "",
    description: "",
    sku: "",
    barcode: "",
    category: "",
    brand: "",
    unit: "",
    purchasePrice: "",
    sellingPrice: "",
    reorderLevel: "",
    reorderQuantity: "",
    isActive: true,
};

const Products = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    const { products, loading, error } = useSelector((state) => state.product);
    const { items: categories } = useSelector((state) => state.category);
    const { user } = useSelector((state) => state.auth);
    const canManageProducts = user?.role === "admin" || user?.department === "inventory";

    const isEdit = location.pathname.includes("/edit/");
    const isView = !!id && !isEdit;
    const selectedProduct = useMemo(
        () => products.find((product) => String(product._id || product.id) === String(id)) || null,
        [products, id]
    );

    const [formData, setFormData] = useState(emptyForm);
    const [search, setSearch] = useState("");
    const [qrImage, setQrImage] = useState("");
    const [qrError, setQrError] = useState("");
    const [formError, setFormError] = useState("");

    useEffect(() => () => {
        if (qrImage) URL.revokeObjectURL(qrImage);
    }, [qrImage]);

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        if (id) {
            dispatch(fetchProductById(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (isEdit || isView) {
            if (selectedProduct) {
                setFormData({
                    ...emptyForm,
                    name: selectedProduct.name || "",
                    description: selectedProduct.description || "",
                    sku: selectedProduct.sku || "",
                    barcode: selectedProduct.barcode || "",
                    category: selectedProduct.category?._id || selectedProduct.category || "",
                    brand: selectedProduct.brand || "",
                    unit: selectedProduct.unit || "",
                    purchasePrice: selectedProduct.purchasePrice ?? "",
                    sellingPrice: selectedProduct.sellingPrice ?? "",
                    reorderLevel: selectedProduct.reorderLevel ?? "",
                    reorderQuantity: selectedProduct.reorderQuantity ?? "",
                    isActive: selectedProduct.isActive !== false,
                });
            } else {
                setFormData(emptyForm);
            }
        }
    }, [selectedProduct, isEdit, isView]);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData((current) => ({
            ...current,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormError("");

        const payload = {
            ...formData,
            purchasePrice: Number(formData.purchasePrice || 0),
            sellingPrice: Number(formData.sellingPrice || 0),
            reorderLevel: Number(formData.reorderLevel || 0),
            reorderQuantity: Number(formData.reorderQuantity || 0),
        };

        try {
            if (isEdit && id) {
                const result = await dispatch(
                    editProduct({ id, productData: payload })
                ).unwrap();

                navigate("/products");
                return;
            }

            const result = await dispatch(createProduct(payload)).unwrap();

            navigate("/products");

        } catch (error) {
            setFormError(typeof error === "string" ? error : error?.message || "Unable to save product.");
        }
    };

    const handleDelete = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            setFormError("");
            try {
                await dispatch(removeProduct(productId)).unwrap();
            } catch (requestError) {
                setFormError(typeof requestError === "string" ? requestError : requestError?.message || "Unable to delete product.");
            }
        }
    };

    const handleShowQr = async (productId) => {
        setQrError("");
        try {
            setQrImage(await getProductQrCode(productId));
        } catch (requestError) {
            setQrError(requestError.response?.data?.message || "Unable to load product QR code.");
        }
    };

    const visibleProducts = products.filter((product) =>
        [product.name, product.sku, product.barcode, product.brand]
            .some((value) => String(value || "").toLowerCase().includes(search.toLowerCase()))
    );

    const isFormPage = location.pathname.includes("/add") || isEdit;

    const renderDetailView = () => (
        <div className="panel">
            <div className="panel-header">
                <h3>Product Details</h3>
                <div className="page-actions">
                    <button className="ghost-button" type="button" onClick={() => navigate("/products")}>Back</button>
                    {canManageProducts && <button className="secondary-button" type="button" onClick={() => navigate(`/products/edit/${id}`)}>Edit</button>}
                </div>
            </div>

            <div className="detail-grid">
                <div className="detail-box"><span>Name</span><strong>{selectedProduct?.name || "—"}</strong></div>
                <div className="detail-box"><span>SKU</span><strong>{selectedProduct?.sku || "—"}</strong></div>
                <div className="detail-box"><span>Category</span><strong>{selectedProduct?.category?.name || selectedProduct?.category || "—"}</strong></div>
                <div className="detail-box"><span>Barcode</span><strong>{selectedProduct?.barcode || "—"}</strong></div>
                <div className="detail-box"><span>Brand</span><strong>{selectedProduct?.brand || "—"}</strong></div>
                <div className="detail-box"><span>Unit</span><strong>{selectedProduct?.unit || "—"}</strong></div>
                <div className="detail-box"><span>Purchase</span><strong>{selectedProduct?.purchasePrice || 0}</strong></div>
                <div className="detail-box"><span>Selling</span><strong>{selectedProduct?.sellingPrice || 0}</strong></div>
                <div className="detail-box"><span>Reorder</span><strong>{selectedProduct?.reorderLevel || 0}</strong></div>
            </div>
        </div>
    );

    return (
        <div>
            <div className="page-header">
                <h1>Products</h1>
                {canManageProducts && <div className="page-actions">
                    <button className="primary-button" type="button" onClick={() => navigate("/products/add")}>Add Product</button>
                </div>}
            </div>

            {(formError || error) && <div className="error-box" role="alert" style={{ marginBottom: "16px" }}>{formError || error}</div>}

            {isView && selectedProduct ? renderDetailView() : null}

            {isFormPage ? (
                <form className="form-card" onSubmit={handleSubmit}>
                    <div className="panel-header">
                        <h3>{isEdit ? "Edit Product" : "Add Product"}</h3>
                    </div>

                    <div className="form-grid">
                        <div className="form-field"><label>Name</label><input name="name" value={formData.name} onChange={handleChange} required /></div>
                        <div className="form-field"><label>SKU</label><input name="sku" value={formData.sku} onChange={handleChange} required /></div>
                        <div className="form-field"><label>Category</label><select name="category" value={formData.category?._id || formData.category || ""} onChange={handleChange} required><option value="">Select category</option>{categories.map((category) => <option key={category._id || category.id} value={category._id || category.id}>{category.name}</option>)}</select></div>
                        <div className="form-field"><label>Brand</label><input name="brand" value={formData.brand} onChange={handleChange} /></div>
                        <div className="form-field"><label>Unit</label><input name="unit" value={formData.unit} onChange={handleChange} /></div>
                        <div className="form-field"><label>Barcode</label><input name="barcode" value={formData.barcode} onChange={handleChange} placeholder="Generated by backend when saved" /></div>
                        <div className="form-field"><label>Purchase Price</label><input type="number" min="0" name="purchasePrice" value={formData.purchasePrice} onChange={handleChange} /></div>
                        <div className="form-field"><label>Selling Price</label><input type="number" min="0" name="sellingPrice" value={formData.sellingPrice} onChange={handleChange} /></div>
                        <div className="form-field"><label>Reorder Level</label><input type="number" min="0" name="reorderLevel" value={formData.reorderLevel} onChange={handleChange} /></div>
                        <div className="form-field"><label>Reorder Quantity</label><input type="number" min="0" name="reorderQuantity" value={formData.reorderQuantity} onChange={handleChange} /></div>
                        <div className="form-field"><label>Status</label><select name="isActive" value={String(formData.isActive)} onChange={(event) => setFormData((current) => ({ ...current, isActive: event.target.value === "true" }))}><option value="true">Active</option><option value="false">Inactive</option></select></div>
                        <div className="form-field" style={{ gridColumn: "1 / -1" }}><label>Description</label><textarea name="description" value={formData.description} onChange={handleChange} /></div>
                    </div>

                    {(formError || error) ? <div className="error-box" role="alert" style={{ marginTop: "16px" }}>{formError || error}</div> : null}

                    <div className="form-row">
                        <button className="ghost-button" type="button" onClick={() => navigate("/products")}>Cancel</button>
                        <button className="primary-button" type="submit" disabled={loading}>{loading ? "Saving..." : isEdit ? "Update Product" : "Save Product"}</button>
                    </div>
                </form>
            ) : null}

            {!isView && !isFormPage ? (
                <div className="panel">
                    <div className="form-field" style={{ marginBottom: "16px" }}>
                        <label htmlFor="product-search">Search products</label>
                        <input id="product-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, SKU, barcode, brand..." />
                    </div>
                    {qrError && <div className="error-box" role="alert" style={{ marginBottom: "16px" }}>{qrError}</div>}
                    {loading && products.length === 0 ? (
                        <Loader label="Loading products..." />
                    ) : visibleProducts.length === 0 ? (
                        <div className="empty-state">No products available yet.</div>
                    ) : (
                        <div className="table-wrap">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>SKU</th>
                                        <th>Barcode</th>
                                        <th>Category</th>
                                        <th>Brand</th>
                                        <th>Unit</th>
                                        <th>Price</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visibleProducts.map((product) => (
                                        <tr key={product._id || product.id}>
                                            <td>{product.name}</td>
                                            <td>{product.sku}</td>
                                            <td>{product.barcode || "—"}</td>
                                            <td>{product.category?.name || "—"}</td>
                                            <td>{product.brand || "—"}</td>
                                            <td>{product.unit || "—"}</td>
                                            <td>{product.sellingPrice || 0}</td>
                                            <td><span className={`badge ${product.isActive === false ? "warning" : "success"}`}>{product.isActive === false ? "Inactive" : "Active"}</span></td>
                                            <td>
                                                <div className="table-actions">
                                                    {canManageProducts && <button className="small-button" type="button" onClick={() => navigate(`/products/${product._id || product.id}`)}>View</button>}
                                                    <button className="small-button" type="button" onClick={() => handleShowQr(product._id || product.id)}>QR</button>
                                                    {canManageProducts && <button className="small-button" type="button" onClick={() => navigate(`/products/edit/${product._id || product.id}`)}>Edit</button>}
                                                    {canManageProducts && <button className="small-button" type="button" onClick={() => handleDelete(product._id || product.id)}>Delete</button>}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ) : null}
            {qrImage && (
                <div className="modal-backdrop" role="presentation" onClick={() => setQrImage("")}>
                    <div className="qr-modal" role="dialog" aria-modal="true" aria-label="Product QR code" onClick={(event) => event.stopPropagation()}>
                        <div className="panel-header"><h3>Product QR Code</h3><button type="button" className="ghost-button" onClick={() => setQrImage("")}>Close</button></div>
                        <img src={qrImage} alt="Product QR code" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;