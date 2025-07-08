import { React, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/common/navbar";
import Footer from "@/components/common/footer";
import TopBar from "@/components/common/topbar";
import Loader from "@/components/common/Loader";
// import Toaster from 'react-hot-toast';

function Layout() {
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const isRootPath = location.pathname === "/";

    useEffect(() => {
        if (isRootPath) {
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 3000);

            return () => clearTimeout(timer);
        } else {
            setIsLoading(false);
        }
    }, [isRootPath]);

    if (isLoading && isRootPath) {
        return <Loader />;
    }

    return (
        <>
            {/* <TopBar /> */}
            <Navbar />
            <Outlet />
            <Footer />
        </>
    );
}

export default Layout;
