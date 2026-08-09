import { useEffect, useState } from "react";
import {
  ChevronDown,
  Download,
  Facebook,
  Github,
  HandCoins,
  Heart,
  X,
} from "lucide-react";

const REPO = "https://github.com/yeshsanchez/Kaiwa";
const FACEBOOK = "https://www.facebook.com/profile.php?id=61591565498265";

type Props = {
  /** The download URL to proceed to, or null when the modal is closed. */
  downloadUrl: string | null;
  onClose: () => void;
};

const OPTION =
  "flex items-center gap-3 rounded-[12px] border border-line bg-white px-4 py-3.5 text-left text-[0.94rem] font-medium text-ink transition-all hover:-translate-y-px hover:border-rose hover:text-deeprose";

/**
 * Support gate shown before a download starts. Made by a solo dev, so it asks —
 * gently — for any form of support: star the repo, follow on Facebook, or donate
 * (reveals a Maya / InstaPay QR). "Continue to download" always proceeds; the
 * app stays free either way.
 */
export default function DonateModal({ downloadUrl, onClose }: Props) {
  const open = downloadUrl !== null;
  const [showQr, setShowQr] = useState(false);

  // Lock body scroll and wire Escape-to-close only while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  // Collapse the QR again whenever the modal closes, so it opens fresh.
  useEffect(() => {
    if (!open) setShowQr(false);
  }, [open]);

  const proceed = () => {
    if (downloadUrl) window.location.href = downloadUrl;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="donate-title"
      aria-hidden={!open}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className={`fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md transition-all duration-300 ${
        open ? "visible opacity-100" : "invisible opacity-0"
      }`}
      style={{ background: "rgba(58,40,48,0.44)" }}
    >
      <div
        className={`relative max-h-[92vh] w-[min(430px,100%)] overflow-y-auto rounded-[22px] border border-line bg-white px-8 pb-7 pt-9 text-center shadow-[0_40px_82px_-30px_rgba(190,55,90,0.5)] transition-transform duration-300 ${
          open ? "translate-y-0 scale-100" : "translate-y-5 scale-95"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-3.5 grid h-9 w-9 place-items-center rounded-full border border-line bg-paper text-ink-soft transition-colors hover:border-rose hover:text-deeprose"
        >
          <X className="h-[17px] w-[17px]" />
        </button>

        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-[13px] border border-rose-soft-2 bg-rose-soft text-deeprose">
          <Heart className="h-6 w-6" strokeWidth={1.9} />
        </div>

        <h3
          id="donate-title"
          className="font-display text-[1.5rem] font-medium text-sumi"
        >
          Support Kaiwa
        </h3>
        <p className="mx-auto mt-3 max-w-[34ch] text-[0.95rem] text-ink-soft">
          This project was made by a solo developer. Any form of support is
          appreciated!
        </p>

        <div className="mt-6 flex flex-col gap-2.5 text-left">
          <a href={REPO} target="_blank" rel="noopener" className={OPTION}>
            <Github className="h-5 w-5 shrink-0" strokeWidth={2} />
            Star the repo on GitHub
          </a>
          <a href={FACEBOOK} target="_blank" rel="noopener" className={OPTION}>
            <Facebook className="h-5 w-5 shrink-0" strokeWidth={2} />
            Follow the Facebook page
          </a>

          <button
            type="button"
            onClick={() => setShowQr((v) => !v)}
            aria-expanded={showQr}
            aria-controls="donate-qr"
            className={OPTION}
          >
            <HandCoins className="h-5 w-5 shrink-0" strokeWidth={2} />
            Donate
            <ChevronDown
              className={`ml-auto h-4 w-4 shrink-0 text-sub transition-transform duration-300 ${
                showQr ? "rotate-180" : ""
              }`}
              strokeWidth={2}
            />
          </button>

          <div
            id="donate-qr"
            className={`grid transition-all duration-300 ease-out ${
              showQr ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="rounded-[14px] border border-line bg-paper-2 p-3 text-center">
                <img
                  src="./qr-donations.jpg"
                  alt="Donation QR code — Maya / InstaPay, Yeshua Aeon Sanchez"
                  loading="lazy"
                  className="mx-auto block w-[min(220px,78%)] rounded-xl border border-line"
                />
                <div className="mt-2 text-[0.78rem] tracking-wide text-sub">
                  Scan with Maya — or any InstaPay banking app
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={proceed}
          className="mt-6 inline-flex w-full items-center justify-center gap-2.5 rounded-full px-8 py-3.5 text-[1rem] font-medium text-white transition-[filter,transform] duration-300 hover:brightness-105"
          style={{ background: "linear-gradient(135deg,#ee6c85 0%,#d94b63 100%)" }}
        >
          <Download className="h-5 w-5" strokeWidth={2.2} />
          Continue to download
        </button>

        <p className="mt-4 text-[0.8rem] tracking-wide text-sub">
          Support is always optional — the download is completely free.
        </p>
      </div>
    </div>
  );
}
