import { useEffect } from 'react';

export default function Terms() {
  useEffect(() => {
    document.title = "Terms & Conditions — NOUS ART";
  }, []);

  return (
    <div className="bg-ink-950 text-ink-50 min-h-screen pt-32 pb-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-ink-50 font-light mb-8">
          Terms & <span className="gold-text-gradient italic">Conditions</span>
        </h1>
        
        <div className="space-y-8 text-ink-200 font-light leading-relaxed">
          <section>
            <h2 className="font-display text-2xl text-gold-400 mb-4">1. Introduction</h2>
            <p>
              Welcome to NOUS ART. These Terms & Conditions govern your use of our website and services. By accessing or using our platform, you agree to be bound by these terms. If you do not agree with any part of these terms, please refrain from using our services.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-gold-400 mb-4">2. Artwork Authenticity</h2>
            <p>
              NOUS ART guarantees the authenticity of all artworks offered on our platform. Every piece is accompanied by a signed Certificate of Authenticity and a verified provenance history, ensuring its origin and value.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-gold-400 mb-4">3. Purchases and Pricing</h2>
            <p>
              All prices are listed in USD unless otherwise noted. Prices are subject to change without prior notice. The acquisition of an artwork is not finalized until full payment has been received and confirmed by NOUS ART.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-gold-400 mb-4">4. Shipping and Returns</h2>
            <p>
              We provide secure, insured global shipping for all our artworks. In the rare event that an artwork arrives damaged, please contact us within 48 hours of delivery. Due to the unique nature of original art, returns are evaluated on a case-by-case basis.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-gold-400 mb-4">5. Intellectual Property</h2>
            <p>
              All content on this website, including but not limited to images, text, logos, and graphics, is the property of NOUS ART or the respective artists. Unauthorized reproduction, distribution, or use of any material without explicit permission is strictly prohibited.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
