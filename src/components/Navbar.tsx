import {Link, useNavigate} from "react-router-dom";
import {IconLogOut} from "./Icons.tsx";

const Navbar = () => {
    const navigate = useNavigate();

    const logoutHandler = () => {
        localStorage.removeItem("token");
        navigate('/login');
    }

    return (
        <div
            className={"flex justify-center mt-[40px] mb-[30px] sm:mb-[35px] md:mb-[40px] lg:mb-[50px] xl:mb-[60px]"}>
            <Link to={'/'}>
                <img className={""} src="/images/logo.png" alt="logo" width="195px" height="102px"/>
            </Link>
            <button
                onClick={logoutHandler}
                className={"absolute top-[20px] right-[20px] min-[450px]:right-[40px] flex items-center text-neutral-400 gap-[6px]"}>
                <IconLogOut/>
                <span className={"hidden md:inline"}>
                    Выйти
                </span>
            </button>
        </div>
    )
}

export default Navbar;