import {useEffect} from "react";
import {Toaster} from "react-hot-toast";
import {Routes, Route, useNavigate, useLocation} from 'react-router-dom';
import PageHome from "./views/page_home";
import PageLogin from "./views/page_login";
import PageClients from "./views/page_clients";
import PageCreateClient from "./views/page_create_client";
import PageCreatePrice from "./views/page_create_price";
import PagePrice from "./views/page_price";
import PageSolution from "./views/page_solution";
import PageCreateSolution from "./views/page_create_solution";
import PageCreateProject from "./views/page_create_project";
import PageProjects from "./views/page_projects";
import PagePriceEdit from "./views/page_price_edit";
import PageSolutionEdit from "./views/page_solution_edit";
import PageProjectEdit from "./views/page_project_edit";
import Navbar from "./components/Navbar.tsx";


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
            <Navbar/>
            <Routes>
                <Route path="/" element={<PageHome/>}/>
                <Route path="/login" element={<PageLogin/>}/>
                <Route path="/price" element={<PagePrice/>}/>
                <Route path="/create-price" element={<PageCreatePrice/>}/>
                <Route path="/edit-price/:id" element={<PagePriceEdit/>}/>
                <Route path="/clients" element={<PageClients/>}/>
                <Route path="/create-client" element={<PageCreateClient/>}/>
                <Route path="/solution" element={<PageSolution/>}/>
                <Route path="/create-solution" element={<PageCreateSolution/>}/>
                <Route path="/edit-solution/:id" element={<PageSolutionEdit/>}/>
                <Route path="/projects" element={<PageProjects/>}/>
                <Route path="/create-project" element={<PageCreateProject/>}/>
                <Route path="/edit-project/:id" element={<PageProjectEdit/>}/>
            </Routes>

            <Toaster
                position="top-right"
                reverseOrder={false}
            />
        </div>
    );
}

export default App;