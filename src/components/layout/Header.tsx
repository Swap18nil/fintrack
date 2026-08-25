import { useLocation } from "react-router-dom";

export const Header = () => {
    const location = useLocation()

    const pageTitle = location.pathname.replace('/', '') || 'dashboard';

    return (
        <>
            <header className="h-16 bg-white border-b-2 border-gray-200 flex items-center px-8">
                <h1 className="text-xl font-semibold text-gray-800 capitalize">
                    {pageTitle}
                </h1>
            </header>
        </>
    )
}