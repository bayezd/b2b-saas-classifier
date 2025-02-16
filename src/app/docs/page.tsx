import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Documentation - B2B SaaS Classifier",
  description: "Learn how to use the B2B SaaS Classifier API and web interface",
}

export default function DocsPage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <h1 className="text-4xl font-bold">Documentation</h1>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Getting Started</h2>
          <p className="text-muted-foreground">
            Learn how to classify B2B companies using our AI-powered platform.
          </p>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Single Domain Classification</h3>
            <ol className="list-decimal space-y-2 pl-4">
              <li>Navigate to the Classification page</li>
              <li>Enter a company domain (e.g., slack.com)</li>
              <li>Click &quot;Classify&quot; to get instant results</li>
            </ol>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Batch Processing</h3>
            <ol className="list-decimal space-y-2 pl-4">
              <li>Prepare a CSV file with company domains</li>
              <li>Upload your file on the Batch Upload page</li>
              <li>Monitor progress and download results</li>
            </ol>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">API Reference</h2>
          <p className="text-muted-foreground">
            Integrate our classification service into your applications.
          </p>
          
          <div className="rounded-lg border bg-muted p-4">
            <pre className="text-sm">
              <code>
                POST /api/classify
                {"\n"}
                {"{"}
                {"\n"}
                {"  "}domain: "example.com"
                {"\n"}
                {"}"}
              </code>
            </pre>
          </div>
        </section>
      </div>
    </div>
  )
}
