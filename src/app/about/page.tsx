import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About - B2B SaaS Classifier",
  description: "Learn about our mission to simplify B2B company classification",
}

export default function AboutPage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <h1 className="text-4xl font-bold">About Us</h1>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Our Mission</h2>
          <p className="text-muted-foreground">
            We're on a mission to simplify B2B company classification using
            cutting-edge AI technology. Our platform helps businesses understand
            their customers and prospects better, enabling more effective
            targeting and engagement.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Technology</h2>
          <p className="text-muted-foreground">
            Our classification engine is powered by GPT-4, combined with
            proprietary algorithms trained on millions of B2B companies. This
            ensures accurate and reliable classifications across industries
            and company sizes.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Key Features</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>• AI-powered classification</li>
            <li>• Bulk processing capabilities</li>
            <li>• Real-time API access</li>
            <li>• CRM integrations</li>
            <li>• Enterprise-grade security</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Contact Us</h2>
          <p className="text-muted-foreground">
            Have questions or need support? We're here to help!
          </p>
          <div className="space-y-2">
            <p>Email: support@b2bclassifier.com</p>
            <p>Twitter: @b2bclassifier</p>
          </div>
        </section>
      </div>
    </div>
  )
}
