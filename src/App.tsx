import {Routes, Route, useNavigate, useLocation, Link} from 'react-router-dom';
import PageHome from "./views/page_home";
import PageLogin from "./views/page_login";
import PageClients from "./views/page_clients";
import PageCreateClient from "./views/page_create_client";
import PageCreatePrice from "./views/page_create_price";
import PagePrice from "./views/page_price";
import {useEffect} from "react";
import {Toaster} from "react-hot-toast";
import {QueryClientProvider} from "react-query";
import queryClient from "./services/queryClient.ts";


function App() {
    const navigate = useNavigate()
    const location = useLocation()
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) navigate('/login');
    }, [])


    if (!token && location.pathname !== '/login') return "Access denied"


    return (
        <div>
            <div
                className={"flex justify-center mt-[40px] mb-[30px] sm:mb-[35px] md:mb-[40px] lg:mb-[50px] xl:mb-[60px]"}>
                <Link to={'/'}>
                    <img className={""} src="/images/logo.png" alt="logo" width="195px" height="102px"/>
                </Link>
            </div>
            <QueryClientProvider client={queryClient}>
                <Routes>
                    <Route path="/" element={<PageHome/>}/>
                    <Route path="/login" element={<PageLogin/>}/>
                    <Route path="/price" element={<PagePrice/>}/>
                    <Route path="/create-price" element={<PageCreatePrice/>}/>
                    <Route path="/clients" element={<PageClients/>}/>
                    <Route path="/create-client" element={<PageCreateClient/>}/>
                </Routes>
            </QueryClientProvider>

            <Toaster
                position="top-right"
                reverseOrder={false}
            />
        </div>
    );
}

export default App;