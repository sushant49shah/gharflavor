import Header from "./Header"
import Footer from "./Footer"
import { Outlet } from "react-router-dom"

const Layout = () => {
  return (
    <div className="min-h-screen w-full max-w-full selection:bg-primary/35 selection:text-white flex flex-col bg-bg-dark text-white">
      <Header />
      <main className="w-full max-w-full flex-1 bg-grid-pattern bg-fixed">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
