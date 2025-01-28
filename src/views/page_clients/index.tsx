import {Link} from "react-router-dom";
import useMainFetch from "../../hooks/useMainFetch.ts";
import Loading from "../../components/Loading.tsx";


const PageClients = () => {
    const {data, isLoading}: { data?: { imageUrl: string}[], isLoading: boolean } = useMainFetch({
        key: 'clients',
        endpoint: "/clients",
        generateData: (res: any) => res?.data?.clients
    })


    return (
        <div className={"pb-[150px]"}>
            <h1 className={"text-4xl font-light text-white text-center mb-[40px] lg:mb-[55px] lg:text-5xl"}>
                Наши клиенты
            </h1>

            {
                isLoading
                    ? <Loading />
                    : data?.length ? "" : <h3 className={"text-white text-2xl text-center"}>Клиент недоступен</h3>
            }

            <div
                className={"grid w-[90%] mx-auto gap-[20px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:w-[535px] md:w-[730px] lg:w-[950px] xl:w-[1100px]"}>
                {data?.map((item, index) => (
                    <img
                        className={"w-[250px] h-[140px] mx-auto object-cover"}
                        src={item.imageUrl}
                        key={index}
                        alt="image"
                    />
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