import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/Footer/Footer'
import SmoothScrollToTop from '../components/ui/smoothScrollToTop'
import { Outlet } from 'react-router'

function Root() {
    return (
        <div className="flex min-h-screen flex-col bg-base-100 text-base-content antialiased">
            <SmoothScrollToTop />
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default Root