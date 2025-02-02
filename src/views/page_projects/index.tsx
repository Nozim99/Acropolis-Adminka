import {useEffect, useState} from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {closestCenter, DndContext, DragEndEvent} from "@dnd-kit/core";
import {arrayMove, rectSortingStrategy, SortableContext} from "@dnd-kit/sortable";
import {BtnFlags} from "../../components/BtnFlags.tsx";
import Loading from "../../components/Loading.tsx";
import MButton from "../../components/MButton.tsx";
import CardItem from "./CardItem.tsx";
import {BASE_URL} from "../../utils/constants.ts";


interface IData {
    title: string;
    title_uz?: string;
    title_en?: string;
    description: string;
    description_uz?: string;
    description_en?: string;
    image: {
        url: string;
    };
    _id: string;
}

const PageProjects = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [currentLng, setCurrentLng] = useState("ru");
    const [data, setData] = useState<IData[]>([])
    const [isChangedSort, setIsChangedSort] = useState(false);


    useEffect(() => {
        axios.get(BASE_URL + '/projects')
            .then(res => {
                const resData = res.data?.projects || [];
                setData(resData)
            })
            .finally(() => setIsLoading(false))
    }, []);

    const handleDragEnd = (event: DragEndEvent) => {
        if (!data) return;

        const {active, over} = event;

        if (over && active.id !== over.id) {
            const oldIndex = data.findIndex(card => card._id === active.id);
            const newIndex = data.findIndex(card => card._id === over.id);
            const sortedArray = arrayMove(data, oldIndex, newIndex);
            setData(sortedArray);
            setIsChangedSort(true)
        }
    };

    const removeDataFromArr = (id: string) => {
        setData(prev => prev.filter(item => item._id !== id))
    }

    const sortPromise = () => {
        const token = localStorage.getItem('token')

        toast.promise(
            axios.put(BASE_URL + '/projects/sort',
                {data: data?.map(item => item._id) || []},
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
        <div className={"pb-[100px]"}>
            {
                isLoading &&
                <Loading/>
            }
            <h2 className={"main_title"}>Проекте</h2>
            <BtnFlags
                changeLng={(lng: string) => setCurrentLng(lng)}
                currentLng={currentLng}
            />
            <div
                className={"mx-auto grid grid-cols-1 gap-y-[25px] pt-[20px] pb-[41px] relative sm:grid-cols-2 sm:pt-[30px] md:pt-[35px] lg:w-[900px] lg:gap-x-[20px] xl:w-[1047px] xl:gap-x-[10px]"}
            >
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={data.map(card => card._id)} strategy={rectSortingStrategy}>
                        {data?.map((project) => (
                            <CardItem
                                key={project._id}
                                removeDataFromArr={() => removeDataFromArr(project._id)}
                                title={
                                    currentLng === 'ru'
                                        ? project.title
                                        : currentLng === 'uz'
                                            ? project.title_uz || project.title
                                            : project.title_en || project.title
                                }
                                description={
                                    currentLng === 'ru'
                                        ? project.description
                                        : currentLng === 'uz'
                                            ? project.description_uz || project.description
                                            : project.description_en || project.description
                                }
                                image={project.image.url}
                                id={project._id}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            </div>
            <MButton pathname={'/create-project'}>
                Добавить
            </MButton>
            {
                isChangedSort &&
                <button
                    onClick={sortPromise}
                    className={`text-white fade-blink-3 flex items-center justify-center border-[3px] rounded-[10px] border-[#D8A227] h-[64px] gap-x-[20px] w-[87%] mx-auto min-[425px]:w-[350px] md:w-[400px] md:h-[78px] lg:h-[82px] lg:w-[420px]
                mt-[20px]`}
                >
                    <span className={"font-medium text-xl md:text-2xl lg:text-3xl"}>Сохранить сортировку</span>
                </button>
            }
        </div>
    )
}

export default PageProjects;