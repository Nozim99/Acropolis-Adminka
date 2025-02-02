import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import toast from "react-hot-toast";
import axios from "axios";
import {closestCenter, DndContext, DragEndEvent} from "@dnd-kit/core";
import {arrayMove, rectSortingStrategy, SortableContext} from "@dnd-kit/sortable";
import Loading from "../../components/Loading.tsx";
import {BtnFlags} from "../../components/BtnFlags.tsx";
import {DFAQItem} from "./DFAQItem.tsx";
import {myFetch} from "../../utils/myFetch.ts";
import {BASE_URL} from "../../utils/constants.ts";


interface CardType {
    title: string;
    title_uz?: string;
    title_en?: string;
    description: string;
    description_uz?: string;
    description_en?: string;
    _id: string;
}

const PagePrice = () => {
    const [currentLng, setCurrentLng] = useState<string>('ru');
    const [cards, setCards] = useState<CardType[]>()
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isChangedSort, setIsChangedSort] = useState<boolean>(false);


    useEffect(() => {
        myFetch({endpoint: "/services"})
            .then(data => {
                setCards(data?.data || [])
            })
            .finally(() => {
                setIsLoading(false);
            })
    }, []);


    const changeLng = (lng: string) => {
        setCurrentLng(lng)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        if (!cards) return;

        const {active, over} = event;

        if (over && active.id !== over.id) {
            const oldIndex = cards.findIndex(card => card._id === active.id);
            const newIndex = cards.findIndex(card => card._id === over.id);
            const sortedArray = arrayMove(cards, oldIndex, newIndex);
            setCards(sortedArray);
            setIsChangedSort(true)
        }
    };

    const removeItem = (id: string) => {
        setCards(prev => {
            if (!prev?.length) return prev;
            return prev.filter(item => item._id !== id);
        })
    }

    const sortPromise = () => {
        const token = localStorage.getItem('token')

        toast.promise(
            axios.put(BASE_URL + '/services/sort',
                {data: cards?.map(item => item._id) || []},
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
                cards
                    ? <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={cards.map(card => card._id)} strategy={rectSortingStrategy}>
                            <div
                                className={"w-[85%] mx-auto grid gap-y-[8px] mb-[43px] md:w-[500px] lg:w-[950px] lg:grid-cols-2 lg:gap-x-[30px] lg:gap-y-[20px]"}>
                                {cards.map((item, index) => (
                                    <DFAQItem
                                        removeItem={() => removeItem(item._id)}
                                        key={item._id}
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
                                        zIndex={11 + cards?.length - index}
                                        id={item._id}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
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

            {
                isChangedSort &&
                <button
                    onClick={sortPromise}
                    className={`fade-blink-3 flex items-center justify-center border-[3px] rounded-[10px] border-[#D8A227] h-[64px] gap-x-[20px] w-[87%] mx-auto min-[425px]:w-[350px] md:w-[400px] md:h-[78px] lg:h-[82px] lg:w-[420px]
                mt-[20px]`}
                >
                    <span className={"font-medium text-xl md:text-2xl lg:text-3xl"}>Сохранить сортировку</span>
                </button>
            }
        </div>
    )
}

export default PagePrice;