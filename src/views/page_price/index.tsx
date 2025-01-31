import FAQItem from "../../components/FAQ_item.tsx";
import {Link} from "react-router-dom";
import useMainFetch from "../../hooks/useMainFetch.ts";
import Loading from "../../components/Loading.tsx";
import {BtnFlags} from "../../components/BtnFlags.tsx";
import {useState} from "react";


interface ResType {
    data?: {
        title: string;
        title_uz?: string;
        title_en?: string;
        description: string;
        description_uz?: string;
        description_en?: string;
        _id: string;
    }[];
    isLoading: boolean;
}

const PagePrice = () => {
    const [currentLng, setCurrentLng] = useState<string>('ru');


    const {data, isLoading}: ResType = useMainFetch({
        key: 'price',
        endpoint: "/services",
        generateData: (res: any) => res?.data
    })

    const changeLng = (lng: string) => {
        setCurrentLng(lng)
    }


    return (
        <div className={"text-white pb-[200px]"}>
            <h1 className={"main_title"}>Услуги</h1>
            <BtnFlags
                currentLng={currentLng}
                changeLng={changeLng}
            />
            {
                isLoading && <Loading/>
            }
            {
                data
                    ? <div
                        className={"w-[85%] mx-auto grid gap-y-[8px] mb-[43px] md:w-[500px] lg:w-[950px] lg:grid-cols-2 lg:gap-x-[30px] lg:gap-y-[20px]"}>
                        {data.map((item, index) => (
                            <FAQItem
                                key={index}
                                isDark={index % 2 === 1}
                                itemNumber={index + 1}
                                title={
                                    currentLng === 'ru'
                                        ? item.title
                                        : currentLng === 'uz'
                                            ? item.title_uz || item.title
                                            : item.title_en || item.title
                                }
                                description={
                                    currentLng === 'ru'
                                        ? item.description
                                        : currentLng === 'uz'
                                            ? item.description_uz || item.description
                                            : item.description_en || item.description
                                }
                                zIndex={11 + data?.length - index}
                                id={item._id}
                            />
                        ))}
                    </div>
                    : <h3 className={"text-2xl text-center container mx-auto mb-[43px]"}>
                        Нет доступных услуг.
                    </h3>
            }

            <Link
                className={"flex items-center justify-center border-[3px] rounded-[10px] border-[#D8A227] h-[64px] gap-x-[20px] w-[87%] mx-auto min-[425px]:w-[350px] md:w-[400px] md:h-[78px] lg:h-[82px] lg:w-[420px]"}
                to={"/create-price"}
            >
                <span className={"text-[#D8A227] text-[60px] font-medium"}>+</span>
                <span className={"font-medium text-xl md:text-2xl lg:text-3xl"}>Добавить услугу</span>
            </Link>
        </div>
    )
}

export default PagePrice;