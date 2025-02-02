import {useEffect, useState} from "react";
import toast from "react-hot-toast";
import axios from "axios";
import Loading from "../../components/Loading.tsx";
import MButton from "../../components/MButton.tsx";
import {BtnFlags} from "../../components/BtnFlags.tsx";
import {CategorySection} from "./CategorySection.tsx";
import {BASE_URL} from "../../utils/constants.ts";


export interface ISolutionItem {
    category: string;
    title: string;
    title_uz?: string;
    title_en?: string;
    description: string[];
    description_uz?: string[];
    description_en?: string[];
    _id: string;
}


const PageSolution = () => {
    const [currentLng, setCurrentLng] = useState<string>('ru');
    const [isChangedSort, setIsChangedSort] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [itCategory, setItCategory] = useState<ISolutionItem[]>([])
    const [ssCategory, setSsCategory] = useState<ISolutionItem[]>([])
    const [isCategory, setIsCategory] = useState<ISolutionItem[]>([])


    useEffect(() => {
        axios.get(BASE_URL + '/solutions')
            .then(res => {
                const itCategories: ISolutionItem[] = []
                const ssCategories: ISolutionItem[] = []
                const isCategories: ISolutionItem[] = []
                res.data?.solutions?.forEach((item: ISolutionItem) => {
                    if (item?.category === 'it-infrastructure') itCategories.push(item);
                    else if (item?.category === 'system-software') ssCategories.push(item);
                    else isCategories.push(item);
                })
                setItCategory(itCategories);
                setSsCategory(ssCategories);
                setIsCategory(isCategories);
            })
            .finally(() => setIsLoading(false))
    }, []);


    const statisticList = [
        {
            img: "/images/laptops-setting.png",
            title: "ИТ-инфраструктура",
            width: 118,
            height: 113,
            key: "it-infrastructure",
            items: itCategory,
            setItems: setItCategory,
        },
        {
            img: "/images/pc-setting.png",
            title: "Системное ПО",
            width: 123,
            height: 115,
            key: 'system-software',
            items: ssCategory,
            setItems: setSsCategory,
        },
        {
            img: "/images/world-security.png",
            title: "Информационная безопасность",
            width: 122,
            height: 122,
            key: 'information-security',
            items: isCategory,
            setItems: setIsCategory,
        },
    ]


    const changeLng = (lng: string) => {
        setCurrentLng(lng)
    }

    const sortPromise = () => {
        const token = localStorage.getItem('token')

        toast.promise(
            axios.put(BASE_URL + '/solutions/sort',
                {data: [...itCategory, ...ssCategory, ...isCategory]?.map(item => item._id) || []},
                {headers: {Authorization: `Bearer ${token}`}}
            ),
            {
                loading: "Loading...",
                success: "Готовый",
                error: "Произошла ошибка.",
            }
        )
            .then(() => {
                setIsChangedSort(false)
            })
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
                    <CategorySection
                        key={index}
                        index={index}
                        title={item.title}
                        width={item.width}
                        height={item.height}
                        items={item.items}
                        currentLng={currentLng}
                        image={item.img}
                        setItems={item.setItems}
                        statisticListLength={statisticList.length}
                        setIsChangedSort={setIsChangedSort}
                    />
                ))}
            </ul>
            <MButton pathname={'/create-solution'}>
                Добавить решение
            </MButton>
            {
                isChangedSort &&
                <button
                    onClick={sortPromise}
                    className={`fade-blink-3 text-white flex items-center justify-center border-[3px] rounded-[10px] border-[#D8A227] h-[64px] gap-x-[20px] w-[87%] mx-auto min-[425px]:w-[350px] md:w-[400px] md:h-[78px] lg:h-[82px] lg:w-[420px]
                mt-[20px]`}
                >
                    <span className={"font-medium text-xl md:text-2xl lg:text-3xl"}>Сохранить сортировку</span>
                </button>
            }
        </div>
    )
}

export default PageSolution;