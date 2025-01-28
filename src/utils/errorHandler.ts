import toast from "react-hot-toast";

export const errorHandler = (error: any) => {
    if (error.response?.status === 401) {
        toast.error("Вам необходимо пройти аутентификацию!")
        localStorage.removeItem("token");
        window.location.href = '/login'
    }
}