import { Sidebar } from "./Sidebar"
import { Outlet } from "react-router-dom"
import { Header } from "./Header"

export const DashboardLayout = () => {

    return (
        <>
            <div className="flex h-screen w-full bg-gray-50">
                <Sidebar />

                <main className="flex-1 flex flex-col overflow-hidden">
                    <Header />

                    <div className="flex-1 overflow-auto p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </>
    )
}