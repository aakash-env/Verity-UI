import Link from "next/link";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
      <Nav />
      <main className="flex-1 max-w-3xl mx-auto px-6 py-16 sm:py-24">
        <div className="mb-10">
          <Link
            href="/"
            className="text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors mb-6 inline-block font-mono"
          >
            ← Back to confirms
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Privacy Policy
          </h1>
          <p className="text-sm text-[var(--color-muted)] font-mono">
            Last updated: September 2026
          </p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-[var(--color-muted)] border-t border-[var(--color-line)] pt-8">
          <section>
            <h2 className="text-base font-semibold text-[var(--color-text)] mb-2">
              1. Information We Collect
            </h2>
            <p>
              When you purchase a license or access Verity, we collect basic transactional
              and identification details such as your name, email address, and payment
              confirmation identifiers. We do not store credit card numbers directly;
              all payments are processed by PCI-compliant payment gateways.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--color-text)] mb-2">
              2. How We Use Information
            </h2>
            <p>
              Your information is solely used to verify your license entitlement, deliver code
              updates, provide customer support, and communicate critical notices regarding
              security and compatibility. We do not sell your personal data to any third parties.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--color-text)] mb-2">
              3. Telemetry and Runtime Privacy
            </h2>
            <p>
              Verity components themselves contain zero runtime telemetry, zero remote tracking
              scripts, and zero phone-home calls. The confirmation blocks execute 100% locally
              within your client applications.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--color-text)] mb-2">
              4. Contact
            </h2>
            <p>
              If you have any questions regarding privacy or data handling, reach out at{" "}
              <a href="mailto:security@verity.dev" className="underline text-[var(--color-text)]">
                security@verity.dev
              </a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
