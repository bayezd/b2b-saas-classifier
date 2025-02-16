import { Spinner } from "@/components/ui/spinner"

export default function LoadingPage() {
  return (
    <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
      <div className="flex items-center space-x-4">
        <Spinner />
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
