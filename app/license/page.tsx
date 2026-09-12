import Link from "next/link";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";

export default function LicensePage() {
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
            License Agreement
          </h1>
          <p className="text-sm text-[var(--color-muted)] font-mono">
            Verity Commercial Software License v1.0
          </p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-[var(--color-muted)] border-t border-[var(--color-line)] pt-8">
          <section>
            <h2 className="text-base font-semibold text-[var(--color-text)] mb-2">
              1. Grant of License
            </h2>
            <p>
              By purchasing or obtaining Verity components, you are granted a
              non-exclusive, worldwide, perpetual license to use, modify, and
              integrate the code into unlimited personal and commercial
              applications, websites, and internal tools.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--color-text)] mb-2">
              2. What You Can Do
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Use the confirmation blocks in any number of commercial SaaS apps, client projects, or internal software.</li>
              <li>Modify, adapt, and customize the source code, styles, and behaviors freely for your specific use case.</li>
              <li>Distribute the code as part of your compiled, end-user accessible application binary or web deployment.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--color-text)] mb-2">
              3. Restrictions
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>You may not re-distribute, re-package, or re-sell Verity components as a UI library, design kit, theme, or template.</li>
              <li>You may not publish the source code in public repositories without compiling or obscuring the library in an application.</li>
              <li>You may not claim ownership or original authorship of the standalone Verity confirmation architecture.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--color-text)] mb-2">
              4. Disclaimer of Warranty
            </h2>
            <p>
              Verity is provided &quot;as is&quot;, without warranty of any kind, express or
              implied, including but not limited to the warranties of merchantability,
              fitness for a particular purpose, and noninfringement.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
