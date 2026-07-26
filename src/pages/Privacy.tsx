import { useEffect } from 'react';

export default function Privacy() {
  useEffect(() => {
    document.title = "Privacy Policy — NOUS ART";
  }, []);

  return (
    <div className="bg-ink-950 text-ink-50 min-h-screen pt-32 pb-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-ink-50 font-light mb-8">
          Privacy <span className="gold-text-gradient italic">Policy</span>
        </h1>
        
        <div className="space-y-8 text-ink-200 font-light leading-relaxed">
          <section>
            <h2 className="font-display text-2xl text-gold-400 mb-4">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when you create an account, subscribe to our newsletter, make a purchase, or communicate with us. This may include your name, email address, postal address, and payment information.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-gold-400 mb-4">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to process transactions, send you gallery updates, improve our services, and respond to your inquiries. We do not sell or rent your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-gold-400 mb-4">3. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, please be aware that no transmission of data over the internet can be guaranteed as completely secure.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-gold-400 mb-4">4. Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal data. If you wish to exercise any of these rights, please contact us at privacy@nousart.gallery.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-gold-400 mb-4">5. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the effective date.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
