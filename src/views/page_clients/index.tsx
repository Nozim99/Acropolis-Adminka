import {Link} from "react-router-dom";
import axios from "axios";
import {useEffect, useState} from "react";
import toast from "react-hot-toast";
import {arrayMove, rectSortingStrategy, SortableContext} from "@dnd-kit/sortable";
import {closestCenter, DndContext, DragEndEvent} from "@dnd-kit/core";
import Loading from "../../components/Loading.tsx";
import {BASE_URL} from "../../utils/constants.ts";
import {ImgCard} from "./ImgCard.tsx";


const PageClients = () => {

    const [data, setData] = useState<{ imageUrl: string; _id: string }[]>()
    const [isChangedSort, setIsChangedSort] = useState(false)
    const [isLoading, setIsLoading] = useState(true)


    useEffect(() => {
        axios.get(BASE_URL + '/clients')
            .then(res => {
                setData(res.data?.clients);
            })
            .finally(() => setIsLoading(false))
    }, []);


    const removeClient = (id: string) => {
        setData(prev => {
            if (!prev?.length) return prev;
            return prev.filter(item => item._id !== id);
        })
    }

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

    const sortPromise = () => {
        const token = localStorage.getItem('token')

        toast.promise(
            axios.put(BASE_URL + '/clients/sort',
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
        <div className={"pb-[150px]"}>
            {
                isLoading &&
                <Loading/>
            }
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
                {
                    data
                        ? <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={data?.map(card => card._id)} strategy={rectSortingStrategy}>
                                {data?.map((item) => (
                                    <ImgCard removeClient={() => removeClient(item._id)} image={item.imageUrl} id={item._id}
                                             key={item._id}/>
                                ))}
                            </SortableContext>
                        </DndContext>
                        : ""
                }

            </div>

            <Link to={"/create-client"}
                  className={"w-[80%] mx-auto mt-[46px] rounded-full border-[3px] border-[#D8A227] flex items-center gap-x-[10px] justify-center min-[390px]:w-[300px] lg:w-[540px] lg:py-[5px]"}>
                <span className={"font-medium text-6xl text-[#D8A227] lg:text-[70px]"}>+</span>
                <span className={"text-white font-medium text-xl lg:text-3xl"}>Добавить клиента</span>
            </Link>
            {
                isChangedSort &&
                <button
                    onClick={sortPromise}
                    className={`text-white fade-blink-3 flex items-center justify-center border-[3px] rounded-full border-[#D8A227] h-[64px] gap-x-[20px] w-[87%] mx-auto min-[425px]:w-[350px] md:w-[400px] md:h-[78px] lg:h-[82px] lg:w-[420px]
                mt-[20px]`}
                >
                    <span className={"font-medium text-xl md:text-2xl lg:text-3xl"}>Сохранить сортировку</span>
                </button>
            }
        </div>
    )
}

export default PageClients;