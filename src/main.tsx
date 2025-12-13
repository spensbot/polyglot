import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { store } from "./state/store.ts"
import "./index.css"
import App from "./app/App.tsx"
import { Toaster } from "./components/ui/sonner.tsx"
// import "@/firebase/initFirebase.ts"

document.documentElement.classList.add("dark")

// Register service worker for PWA functionality
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/polyglot/sw.js").then(
      (registration) => {
        console.log("Service Worker registered:", registration.scope)
      },
      (error) => {
        console.log("Service Worker registration failed:", error)
      }
    )
  })
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <Toaster theme="dark" position="top-center" />
    </Provider>
  </StrictMode>
)
