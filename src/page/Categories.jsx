import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCategory, editCategory, fetchCategories, removeCategory } from "../redux/slices/categorySlice";
import Loader from "../components/Loader";

const initialForm = { name: "", description: "" };

const Categories = () => {
  const dispatch = useDispatch();
  const { items: categories, loading, error } = useSelector((state) => state.category);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (editingId) {
      await dispatch(editCategory({ id: editingId, categoryData: formData })).unwrap();
      setEditingId(null);
    } else {
      await dispatch(createCategory(formData)).unwrap();
    }
    setFormData(initialForm);
  };

  const handleEdit = (category) => {
    setEditingId(category._id || category.id);
    setFormData({ name: category.name || "", description: category.description || "" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this category?")) {
      await dispatch(removeCategory(id)).unwrap();
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Categories</h1>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field">
            <label>Name</label>
            <input value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} required />
          </div>
          <div className="form-field">
            <label>Description</label>
            <input value={formData.description} onChange={(event) => setFormData({ ...formData, description: event.target.value })} />
          </div>
        </div>

        {error ? <div className="error-box" style={{ marginTop: "16px" }}>{error}</div> : null}

        <div className="form-row">
          {editingId ? <button className="ghost-button" type="button" onClick={() => { setEditingId(null); setFormData(initialForm); }}>Cancel</button> : null}
          <button className="primary-button" type="submit" disabled={loading}>{loading ? "Saving..." : editingId ? "Update Category" : "Add Category"}</button>
        </div>
      </form>

      <div className="panel" style={{ marginTop: "20px" }}>
        {loading && categories.length === 0 ? (
          <Loader label="Loading categories..." />
        ) : categories.length === 0 ? (
          <div className="empty-state">No categories available yet.</div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category._id || category.id}>
                    <td>{category.name}</td>
                    <td>{category.description || "—"}</td>
                    <td>
                      <div className="table-actions">
                        <button className="small-button" type="button" onClick={() => handleEdit(category)}>Edit</button>
                        <button className="small-button" type="button" onClick={() => handleDelete(category._id || category.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;