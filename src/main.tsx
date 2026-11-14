import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Landing } from "@/landing/landing"
import { App } from "@/app/app"
import { ApiError } from "@/api/client"
import "./index.css"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (failureCount, error) =>
        failureCount < 1 && !(error instanceof ApiError && error.status >= 400 && error.status < 500),
    },
  },
})

const isExplorer = window.location.pathname.replace(/\/$/, "") === "/explorer"
document.documentElement.lang = isExplorer ? "ru" : "en"
document.documentElement.classList.toggle("dark", isExplorer)
document.title = isExplorer ? "IGNIS 0G — Explorer" : "IGNIS 0G — Microgravity Research Explorer"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {isExplorer ? (
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    ) : <Landing />}
  </StrictMode>,
)
