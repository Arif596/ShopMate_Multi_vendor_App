import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Package,
  ListOrdered,
  Wallet,
  Plus,
  X,
  ImagePlus,
  Trash2,
  Loader2,
  PackageOpen,
  AlertTriangle,
} from "lucide-react";

const CATEGORIES = ["Electronics", "Fashion", "Home", "Beauty", "Sports", "Books", "Other"];
const MAX_IMAGES = 5;
const MAX_MB = 5;

const EMPTY_FORM = { name: "", category: "", price: "", stock: "", description: "" };

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground " +
  "placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";

const Field = ({ label, error, hint, children }) => (
  <div>
    <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
    {children}
    {error ? (
      <p className="mt-1 text-xs text-red-500">{error}</p>
    ) : hint ? (
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    ) : null}
  </div>
);

/* ===================== ADD PRODUCT MODAL ===================== */
const AddProductModal = ({ open, onClose, onSubmit }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [images, setImages] = useState([]); // [{ file, url }]
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");
  const fileRef = useRef(null);

  // reset on open, close on Escape, lock page scroll
  useEffect(() => {
    if (!open) return;
    setForm(EMPTY_FORM);
    setImages([]);
    setErrors({});
    setServerError("");
    const onKey = (e) => e.key === "Escape" && !saving && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // free preview URLs
  useEffect(() => () => images.forEach((i) => URL.revokeObjectURL(i.url)), [images]);

  if (!open) return null;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const addFiles = (e) => {
    const picked = Array.from(e.target.files || []);
    e.target.value = "";
    const valid = [];
    let msg = "";
    for (const file of picked) {
      if (!file.type.startsWith("image/")) msg = "Only image files are allowed";
      else if (file.size > MAX_MB * 1024 * 1024) msg = `Each image must be under ${MAX_MB} MB`;
      else valid.push({ file, url: URL.createObjectURL(file) });
    }
    setImages((prev) => {
      const next = [...prev, ...valid];
      if (next.length > MAX_IMAGES) msg = `You can upload up to ${MAX_IMAGES} images`;
      return next.slice(0, MAX_IMAGES);
    });
    setErrors((p) => ({ ...p, images: msg }));
  };

  const removeImage = (idx) =>
    setImages((prev) => prev.filter((_, i) => i !== idx));

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 3) e.name = "Enter a name with at least 3 characters";
    if (!form.category) e.category = "Choose a category";
    if (!(Number(form.price) > 0)) e.price = "Enter a price greater than 0";
    if (!(Number.isInteger(Number(form.stock)) && Number(form.stock) >= 0) || form.stock === "")
      e.stock = "Enter a whole number, 0 or more";
    if (form.description.trim().length < 20)
      e.description = "Describe the product in at least 20 characters";
    if (images.length === 0) e.images = "Add at least one product image";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setServerError("");
    try {
      const data = new FormData();
      data.append("name", form.name.trim());
      data.append("category", form.category);
      data.append("price", form.price);
      data.append("stock", form.stock);
      data.append("description", form.description.trim());
      images.forEach((i) => data.append("images", i.file));
      await onSubmit(data);
      onClose();
    } catch (err) {
      setServerError(err?.message || "Could not save the product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && !saving && onClose()}
    >
      <form
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-product-title"
        noValidate
        className="flex max-h-[92vh] w-full max-w-2xl flex-col rounded-t-2xl border border-border bg-card shadow-2xl sm:rounded-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
          <div>
            <h2 id="add-product-title" className="text-lg font-semibold text-foreground">
              Add product
            </h2>
            <p className="text-sm text-muted-foreground">
              Fill in the details customers will see on your listing.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close"
            className="rounded-lg p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 overflow-y-auto px-6 py-5">
          <Field label="Product name" error={errors.name}>
            <input
              className={inputCls}
              value={form.name}
              onChange={set("name")}
              placeholder="e.g. Wireless noise-cancelling headphones"
              maxLength={120}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Category" error={errors.category}>
              <select className={inputCls} value={form.category} onChange={set("category")}>
                <option value="">Select</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Price (Rs)" error={errors.price}>
              <input
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                className={inputCls}
                value={form.price}
                onChange={set("price")}
                placeholder="0.00"
              />
            </Field>
            <Field label="Stock" error={errors.stock}>
              <input
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                className={inputCls}
                value={form.stock}
                onChange={set("stock")}
                placeholder="0"
              />
            </Field>
          </div>

          <Field
            label="Description"
            error={errors.description}
            hint={`${form.description.trim().length}/20 minimum characters`}
          >
            <textarea
              rows={4}
              className={`${inputCls} resize-none`}
              value={form.description}
              onChange={set("description")}
              placeholder="Materials, size, what's in the box, warranty..."
            />
          </Field>

          <Field
            label="Images"
            error={errors.images}
            hint={`Up to ${MAX_IMAGES} images, ${MAX_MB} MB each. The first image is the cover.`}
          >
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
              {images.map((img, idx) => (
                <div
                  key={img.url}
                  className="group relative aspect-square overflow-hidden rounded-lg border border-border"
                >
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                  {idx === 0 && (
                    <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                      Cover
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    aria-label="Remove image"
                    className="absolute right-1 top-1 rounded-md bg-black/70 p-1 text-white opacity-0 transition focus:opacity-100 group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {images.length < MAX_IMAGES && (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border text-muted-foreground transition hover:border-primary hover:text-primary"
                >
                  <ImagePlus className="h-5 w-5" />
                  <span className="text-xs">Add</span>
                </button>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={addFiles}
            />
          </Field>

          {serverError && (
            <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              {serverError}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-secondary disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? "Saving..." : "Save product"}
          </button>
        </div>
      </form>
    </div>
  );
};

/* ======================= DASHBOARD PAGE ======================= */
const VendorDashboard = () => {
  const user = useSelector((state) => state.auth?.authUser);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState("");

  // TODO: replace with real data from your backend / redux
  const products = [];
  const orders = [];

  const stats = useMemo(
    () => [
      { title: "Products", value: products.length, icon: Package },
      { title: "Orders", value: orders.length, icon: ListOrdered },
      {
        title: "Revenue",
        value: `Rs ${orders.reduce((s, o) => s + (o.total || 0), 0).toLocaleString()}`,
        icon: Wallet,
      },
    ],
    [products.length, orders],
  );

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const createProduct = async (formData) => {
    // TODO: connect to your API, e.g.
    // await axiosInstance.post("/product/vendor/create", formData);
    // and throw new Error("message") on failure so the modal shows it.
    await new Promise((r) => setTimeout(r, 600));
    setToast("Product saved");
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="mx-auto max-w-7xl px-4 pb-12 pt-24">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            {greeting}, {user?.name?.split(" ")[0] || "there"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your products and track your orders in one place.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Add product
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ title, value, icon: Icon }) => (
          <div key={title} className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold text-foreground">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        {/* Products */}
        <section className="rounded-xl border border-border bg-card lg:col-span-3">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-semibold text-foreground">Your products</h2>
            {products.length > 0 && (
              <Link to="/vendor/products" className="text-sm text-primary hover:underline">
                View all
              </Link>
            )}
          </div>
          {products.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-14 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                <PackageOpen className="h-7 w-7" />
              </div>
              <p className="font-medium text-foreground">No products yet</p>
              <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                Add your first product to start selling on Shop Mate.
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="mt-5 flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                <Plus className="h-4 w-4" /> Add product
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {products.slice(0, 5).map((p) => (
                <li key={p.id} className="flex items-center gap-4 px-5 py-3">
                  <img src={p.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.category}</p>
                  </div>
                  <p className="text-sm font-medium text-foreground">Rs {p.price}</p>
                  <p className="w-16 text-right text-xs text-muted-foreground">{p.stock} in stock</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Orders */}
        <section className="rounded-xl border border-border bg-card lg:col-span-2">
          <div className="border-b border-border px-5 py-4">
            <h2 className="font-semibold text-foreground">Recent orders</h2>
          </div>
          {orders.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <p className="font-medium text-foreground">No orders yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Orders for your products will show up here.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {orders.slice(0, 6).map((o) => (
                <li key={o.id} className="flex items-center justify-between px-5 py-3 text-sm">
                  <span className="text-foreground">#{String(o.id).slice(0, 8)}</span>
                  <span className="text-muted-foreground">{o.status}</span>
                  <span className="font-medium text-foreground">Rs {o.total}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <Link to="/" className="mt-8 inline-block text-sm text-muted-foreground hover:text-primary">
        Back to store
      </Link>

      <AddProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={createProduct}
      />

      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-lg"
        >
          {toast}
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;