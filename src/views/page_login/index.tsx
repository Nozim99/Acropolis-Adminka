import {FormEvent, useState} from "react";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import {myFetch} from "../../utils/myFetch.ts";

const PageLogin = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);


    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const name_input = document.getElementById('name') as HTMLInputElement;
        const password_input = document.getElementById('password') as HTMLInputElement;

        setIsLoading(true);
        toast.promise(
            myFetch({
                endpoint: "/auth/login",
                method: "post",
                data: {username: name_input.value, password: password_input.value}
            }),
            {
                loading: 'Загрузка...',
                success: <b>Вы зарегистрированы!</b>,
                error: <b>Вы ввели неверный логин или пароль!</b>,
            }
        )
            .then((result) => {
                const token = result.data.token;
                localStorage.setItem('token', token);
                setIsLoading(false);
                navigate("/")
            })
            .catch((error) => {
                console.error(error)
                setTimeout(() => setIsLoading(false), 500)
            })
    }


    return (
        <div>
            <form onSubmit={onSubmit}
                  className={"bg-white pt-[22px] text-black px-[20px] pb-[46px] rounded-[10px] mx-[27px] min-[480px]:w-[300px] min-[480px]:mx-auto lg:w-[586px] lg:mb-[64px] lg:px-[57px]"}>
                <h2 className={"text-center font-light text-xl mb-[24px] lg:text-4xl"}>Войти в личный кабинет</h2>
                <input
                    id={"name"}
                    className={"mb-[13px] rounded-full px-[16px] py-[8px] border border-black block w-full lg:mb-[20px]"}
                    type="text"
                    placeholder={"Логин"}
                />
                <input
                    id={"password"}
                    className={"rounded-full px-[16px] py-[8px] border border-black block w-full"}
                    type="password"
                    placeholder={"Пароль"}
                />
                <button
                    disabled={isLoading}
                    className={"block w-full rounded-full bg-[#D8A227] font-light text-xl py-[8px] mt-[20px] lg:mt-[37px]"}>
                    Войти
                </button>
            </form>
        </div>
    )
}

export default PageLogin;