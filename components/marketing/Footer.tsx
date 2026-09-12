import Link from "next/link";

export function Footer() {
  return (
    <footer className="bencho-footer" role="contentinfo">
      {/* Left: Attribution */}
      <div className="bencho-footer__left">
        <span className="text-[var(--color-muted)]">Built by </span>
        <a
          href="https://x.com/aakash_env"
          target="_blank"
          rel="noopener noreferrer"
          className="bencho-footer__author"
        >
          Aakash Sharma
        </a>
      </div>

      {/* Center: Copyright */}
      <div className="bencho-footer__center">
        <span>© {new Date().getFullYear()}</span>
      </div>

      {/* Right: Legal & Social links */}
      <div className="bencho-footer__right">
        <Link href="/privacy" className="bencho-footer__link">
          Privacy
        </Link>
        <Link href="/license" className="bencho-footer__link">
          Licence
        </Link>
        <a
          href="https://x.com/aakash_env"
          target="_blank"
          rel="noopener noreferrer"
          className="bencho-footer__icon-link"
          aria-label="X (formerly Twitter)"
        >
          <XIcon />
        </a>
        <a
          href="mailto:aakashsharma.ghd@gmail.com"
          className="bencho-footer__icon-link"
          aria-label="Email contact"
        >
          <MailIcon />
        </a>
      </div>
    </footer>
  );
}

function XIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
