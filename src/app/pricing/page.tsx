import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Pricing - B2B SaaS Classifier",
  description: "Simple and transparent pricing for B2B company classification",
}

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for trying out our service",
    features: [
      "50 single classifications per month",
      "Basic API access",
      "Community support",
      "Standard response time",
    ],
    cta: "Get Started",
    href: "/get-started",
  },
  {
    name: "Pro",
    price: "$49",
    period: "per month",
    description: "For growing businesses and teams",
    features: [
      "1,000 classifications per month",
      "Full API access",
      "Batch processing",
      "Priority support",
      "99.9% uptime SLA",
      "Custom integrations",
    ],
    cta: "Start Free Trial",
    href: "/get-started",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations with specific needs",
    features: [
      "Unlimited classifications",
      "Dedicated support",
      "Custom ML model training",
      "Advanced analytics",
      "SSO & team management",
      "Custom contract & SLA",
    ],
    cta: "Contact Sales",
    href: "/get-started",
  },
]

export default function PricingPage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-5xl space-y-8 text-center">
        <h1 className="text-4xl font-bold">Simple, Transparent Pricing</h1>
        <p className="text-xl text-muted-foreground">
          Choose the plan that best fits your needs
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg border p-8 ${
                plan.highlighted
                  ? "border-primary bg-primary/5 shadow-lg"
                  : "bg-card"
              }`}
            >
              <h2 className="text-2xl font-bold">{plan.name}</h2>
              <div className="mt-4 space-y-2">
                <div className="text-3xl font-bold">{plan.price}</div>
                {plan.period && (
                  <div className="text-sm text-muted-foreground">
                    {plan.period}
                  </div>
                )}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                {plan.description}
              </p>
              <ul className="mt-8 space-y-3 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <svg
                      className="mr-3 h-4 w-4 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="mt-8 w-full" asChild>
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
