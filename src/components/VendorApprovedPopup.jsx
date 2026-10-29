import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PartyPopper, X } from "lucide-react";

const VendorApprovedPopup = () => {
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth?.authUser);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "Vendor") {
      setOpen(false);
      return;
    }
    try {
      if (!localStorage.getItem(`vendorWelcomeSeen_${user.id}`)) {
        setOpen(true);
      }
    } catch {
      /* ignore */
    }
  }, [user?.id, user?.role]);

  const close = () => {
    try {
      localStorage.setItem(`vendorWelcomeSeen_${user.id}`, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 text-center shadow-xl">
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="ml-auto block"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>

        <PartyPopper className="mx-auto mb-3 h-12 w-12 text-primary" />
        <h2 className="mb-2 text-xl font-semibold text-foreground">
          Congratulations, {user.name}!
        </h2>
        <p className="mb-5 text-sm text-muted-foreground">
          Your vendor request has been approved. You can now add products and
          manage your store from the vendor dashboard.
        </p>

        <button
          type="button"
          onClick={() => {
            close();
            navigate("/vendor/dashboard");
          }}
          className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Go to Vendor Dashboard
        </button>
      </div>
    </div>
  );
};

export default VendorApprovedPopup;