import useMainFetch from "../../hooks/useMainFetch.ts";
import MnFAQItem from "../../components/MnFAQItem.tsx";
import Loading from "../../components/Loading.tsx";
import MButton from "../../components/MButton.tsx";
import {BtnFlags} from "../../components/BtnFlags.tsx";
import {useState} from "react";


interface ResType {
    data?: {
        category: string;
        title: string;
        title_uz?: string;
        title_en?: string;
        description: string[];
        description_uz?: string[];
        description_en?: string[];
        _id: string;
    }[];
    isLoading: boolean;
}


const PageSolution = () => {
    const [currentLng, setCurrentLng] = useState<string>('ru');

    const {data, isLoading}: ResType = useMainFetch({
        key: 'solutions',
        endpoint: "/solutions",
        generateData: (res: any) => res?.data?.solutions
    })


    const statisticList = [
        {
            img: "/images/laptops-setting.png",
            title: "ИТ-инфраструктура",
            width: 118,
            height: 113,
            key: "it-infrastructure",
            items: data?.filter(item => item.category === 'it-infrastructure') || [],
        },
        {
            img: "/images/pc-setting.png",
            title: "Системное ПО",
            width: 123,
            height: 115,
            key: 'system-software',
            items: data?.filter(item => item.category === 'system-software') || [],
        },
        {
            img: "/images/world-security.png",
            title: "Информационная безопасность",
            width: 122,
            height: 122,
            key: 'information-security',
            items: data?.filter(item => item.category === 'information-security') || [],
        },
    ]


    const changeLng = (lng: string) => {
        setCurrentLng(lng)
    }


    return (
        <div className={"pb-[100px] lg:pb-[160px]"}>
            {
                isLoading && <Loading/>
            }
            <h2 className={"main_title"}>Решения</h2>
            <BtnFlags
                currentLng={currentLng}
                changeLng={changeLng}
            />
            <ul className={"grid grid-cols-1 gap-y-[20px] lg:grid-cols-3 lg:gap-[15px] xl:gap-[10px] text-white container mx-auto px-[10px] mb-[20px] sm:mb-[30px] mt-[30px] lg:mt-[50px]"}>
                {statisticList.map((item, index) => (
                    <li key={index} className={"mb-[30px]"}>
                        <div
                            className={"flex items-center gap-[10px] flex-col lg:flex-row mb-[14px] lg:mb-0"}
                        >
                            <div
                                className={`w-[100px] h-[100px] rounded-full flex justify-center items-center bg-white/10 p-[18px] sm:w-[130px] sm:h-[130px] sm:p-[24px] lg:w-[120px] lg:h-[120px]
                                xl:w-[180px] xl:h-[180px]`}>
                                <img
                                    className={`${
                                        index === 0
                                            ? "xl:w-[118px] xl:h-[113px]"
                                            : index === 1
                                                ? "xl:w-[123px] xl:h-[115px]"
                                                : "xl:w-[122px] xl:h-[122px]"
                                    }                                    
                                    w-full h-full object-center object-cover`}
                                    src={item.img}
                                    alt={item.title}
                                    width={item.width}
                                    height={item.height}
                                />
                            </div>
                            <span
                                className={"font-medium text-lg flex-1 sm:text-center lg:text-start lg:text-xl xl:text-2xl"}>{item.title}</span>
                        </div>
                        {/*<div className={"grid gap-[8px] lg:hidden"}>*/}
                        <div className={"grid gap-[8px] mt-[10px] xl:mt-[16px]"}>
                            {item.items.map((i_item, i_index) => (
                                <MnFAQItem
                                    title={
                                        currentLng === 'ru'
                                            ? i_item.title
                                            : currentLng === 'uz'
                                                ? i_item.title_uz || i_item.title
                                                : i_item.title_en || i_item.title
                                    }
                                    description={
                                        currentLng === 'ru'
                                            ? i_item.description
                                            : currentLng === 'uz'
                                                ? i_item.description_uz || i_item.description
                                                : i_item.description_en || i_item.description
                                    }
                                    key={i_index}
                                    zIndex={11 + statisticList.length - i_index}
                                    isYellow={i_index % 2 == 0}
                                    id={i_item._id}
                                />
                            ))}
                        </div>
                    </li>
                ))}
            </ul>
            <MButton pathname={'/create-solution'}>
                Добавить решение
            </MButton>
        </div>
    )
}

export default PageSolution;