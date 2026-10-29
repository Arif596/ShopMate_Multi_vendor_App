import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader2, X } from "lucide-react";
import { toast } from "react-toastify"; // apni toast library ke mutabiq badlo
import { axiosInstance } from "../lib/axios"; // apna axios path/naam use karo
import { toggleVendorModal } from "../store/slices/popupSlice";

const VendorRequestModal = () => {
  const dispatch = useDispatch();
  const open = useSelector((s) => s.popup.isVendorModalOpen);
  const user = useSelector((s) => s.auth?.authUser);

  const [name, setName] = useState(user?.name || "");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open || !user) return null;

  const close = () => {
    if (!loading) dispatch(toggleVendorModal());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (reason.trim().length < 20) {
      toast.error("Reason must be at least 20 characters");
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post("/vendor-requests", {
        name: name.trim(),
        reason: reason.trim(),
      });
      toast.success("Request sent! Admin will review it soon.");
      setReason("");
      dispatch(toggleVendorModal());
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  const input =
    "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-2xl border border-border bg-background p-6 shadow-xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Become a Vendor</h2>
            <p className="text-sm text-muted-foreground">
              Tell us why you want to sell on Shop Mate.
            </p>
          </div>
          <button type="button" onClick={close} aria-label="Close">
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Name</label>
          <input className={input} value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
          <input className={input} value={user.email} disabled readOnly />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Why do you want to be a vendor?
          </label>
          <textarea
            className={input}
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="What will you sell? Tell us about your business (min 20 characters)"
            required
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={close}
            disabled={loading}
            className="rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-w-[110px] items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VendorRequestModal;