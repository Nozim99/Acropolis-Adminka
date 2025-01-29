import {Link} from "react-router-dom";
import useMainFetch from "../../hooks/useMainFetch.ts";
import Loading from "../../components/Loading.tsx";
import toast from "react-hot-toast";
import axios from "axios";
import {BASE_URL} from "../../utils/myFetch.ts";
import {useQueryClient} from "react-query";
import {useState} from "react";


const PageClients = () => {
    const queryClient = useQueryClient()
    const [isLoadingBtn, setIsLoadingBtn] = useState(false)

    const {data, isLoading}: { data?: { imageUrl: string, _id: string }[], isLoading: boolean } = useMainFetch({
        key: 'clients',
        endpoint: "/clients",
        generateData: (res: any) => res?.data?.clients
    })


    const deleteItem = (id: string) => {
        const token = localStorage.getItem("token")

        setIsLoadingBtn(true)
        toast.promise(
            axios.delete(BASE_URL + '/clients/' + id, {headers: {Authorization: `Bearer ${token}`}}),
            {
                loading: "Loading...",
                success: "Удалено",
                error: "Произошла ошибка.",
            }
        )
            .then(() => {
                queryClient.invalidateQueries('clients')
            })
            .finally(() => setIsLoadingBtn(false))
    }


    return (
        <div className={"pb-[150px]"}>
            <h1 className={"text-4xl font-light text-white text-center mb-[40px] lg:mb-[55px] lg:text-5xl"}>
                Наши клиенты
            </h1>

            {
                isLoading
                    ? <Loading/>
                    : data?.length ? "" : <h3 className={"text-white text-2xl text-center"}>Клиент недоступен</h3>
            }

            <div
                className={"grid w-[90%] mx-auto gap-[20px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:w-[535px] md:w-[730px] lg:w-[950px] xl:w-[1100px]"}>
                {data?.map((item, index) => (
                    <div className={"relative mx-auto"}>
                        <button
                            onClick={()=>deleteItem(item._id)}
                            disabled={isLoadingBtn}
                            className={"absolute  right-[6px] top-[4px] text-white bg-neutral-700 hover:bg-neutral-600 px-[10px] py-[2px] rounded text-sm"}>
                            Delete
                        </button>
                        <img
                            className={"w-[250px] h-[140px] object-cover"}
                            src={item.imageUrl}
                            key={index}
                            alt="image"
                        />
                    </div>
                ))}
            </div>

            <Link to={"/create-client"}
                  className={"w-[80%] mx-auto mt-[46px] rounded-full border-[3px] border-[#D8A227] flex items-center gap-x-[10px] justify-center min-[390px]:w-[300px] lg:w-[540px] lg:py-[5px]"}>
                <span className={"font-medium text-6xl text-[#D8A227] lg:text-[70px]"}>+</span>
                <span className={"text-white font-medium text-xl lg:text-3xl"}>Добавить клиента</span>
            </Link>
        </div>
    )
}

export default PageClients;