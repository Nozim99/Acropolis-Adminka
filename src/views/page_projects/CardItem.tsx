import {createPortal} from "react-dom";
import {useEffect, useRef, useState} from "react";
import toast from "react-hot-toast";
import axios from "axios";
import {Link} from "react-router-dom";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {BASE_URL} from "../../utils/constants.ts";
import DeleteModal from "../../components/DeleteModal.tsx";
import {CloseIcon, IconDelete, IconDod3, IconEdit, IconLine2} from "../../components/Icons.tsx";


interface IProps {
    image: string;
    title: string;
    description: string;
    id: string;
    removeDataFromArr: () => void;
}


const CardItem = ({image, title, description, id, removeDataFromArr}: IProps) => {
    const editRef = useRef<HTMLDivElement>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [modal, setModal] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id});
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (editRef.current && !editRef.current.contains(event.target as Node)) setIsEditOpen(false);
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [])


    const deleteItem = () => {
        const token = localStorage.getItem("token")

        toast.promise(
            axios.delete(BASE_URL + '/projects/' + id, {headers: {Authorization: `Bearer ${token}`}}),
            {
                loading: "Loading...",
                success: "Удалено",
                error: "Произошла ошибка.",
            }
        )
            .then(() => {
                removeDataFromArr()
            })
        setModal(false)
    }


    return (
        <>
            {
                modal &&
                <DeleteModal closeModal={() => setModal(false)} deleteHandler={deleteItem}/>
            }
            <div ref={setNodeRef} style={style} className={"mx-auto text-white rounded-tr-[10px]"}>
                <div
                    className={"relative w-[290px] h-[170px] rounded-[10px]  overflow-hidden sm:w-[275px] sm:h-[160px] md:w-[320px] md:h-[195px] lg:w-[420px] lg:h-[250px] xl:w-[474px] xl:h-[278px]"}
                >
                    <div className={"absolute flex items-center right-[10px] top-[6px] gap-[10px]"}>
                        <div
                            className={"flex items-center justify-center z-10 relative"}>
                            <button onClick={() => setIsEditOpen(true)}
                                    className={"border-2 border-white/60 rounded-full p-[2px] bg-black/50 backdrop-blur"}>
                                <IconDod3/>
                            </button>
                            {isEditOpen && <div
                                className={"absolute top-1/2 -translate-y-1/2 inset-0  z-10 w-[30px] h-[33px]"}></div>}
                            <div
                                ref={editRef}
                                className={`${isEditOpen ? "max-h-[100px]" : "max-h-0 pointer-events-none"} z-30 ease-out overflow-hidden transition-all duration-500 absolute flex flex-col bg-white text-black right-0 top-full rounded rounded-tr-0`}
                            >
                                <button
                                    onClick={() => setModal(true)}
                                    className={"px-[30px] py-[8px] hover:bg-black/20 transition-all duration-300 flex items-center gap-[6px]"}>
                                    <IconDelete className={"w-[20px] h-auto"}/>
                                    <span>Удалить</span>
                                </button>
                                <hr/>
                                <Link
                                    to={'/edit-project/' + id}
                                    className={"px-[30px] py-[8px] hover:bg-black/20 transition-all duration-300 flex items-center gap-[6px]"}>
                                    <IconEdit/>
                                    <span>Редактировать</span>
                                </Link>
                            </div>
                        </div>
                        <button {...listeners} {...attributes}
                                className={"w-[30px] backdrop-blur h-[30px] border flex items-center justify-center cursor-grab active:cursor-grabbing transition-all rounded bg-black/30"}>
                            <IconLine2/>
                        </button>
                    </div>
                    <img src={image} alt={title} width={474} height={278}
                         className={"object-center object-cover w-full h-full border border-black/10"}/>
                </div>
                <div
                    className={"flex justify-between px-[4px] py-[8px] font-bold sm:text-sm md:text-base lg:text-lg lg:px-[10px] xl:px-[12px] lg:py-[13px] xl:py-[17px]"}
                >
                    <span>{title}</span>
                    <button onClick={() => setIsOpen(true)}>
                        Описание
                    </button>
                </div>
            </div>
            {
                isOpen &&
                createPortal(
                    <>
                        <div
                            className={`description_modal fixed w-[90%] min-h-[300px] lg:min-h-[350px] max-h-[400px] lg:max-h-[600px] overflow-y-auto bg-white left-1/2 -translate-x-1/2 z-30 top-1/2 -translate-y-1/2 rounded-[8px] text-black px-[20px] pb-[20px] pt-[20px] md:w-[700px] lg:w-[800px]`}>
                            <div className={"flex items-start justify-between mb-[14px]"}>
                                <h2 className={"flex gap-x-[20px] items-center font-semibold sm:text-lg md:text-xl lg:text-2xl"}>
                                    {title}
                                </h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className={""}
                                >
                                    <CloseIcon/>
                                </button>
                            </div>
                            <div className={"text-sm gap-[2px] sm:text-base lg:text-lg"}>
                                {
                                    description.split('\n').map((p_item, p_index) => (
                                        <p key={p_index}>
                                            {p_item}
                                        </p>
                                    ))
                                }
                            </div>
                        </div>
                        <div onClick={() => setIsOpen(false)}
                             className={"fixed description_modal_bg inset-0 backdrop-blur-[3px] bg-black/50 z-20"}></div>
                    </>,
                    document.body
                )}
        </>
    )
}

export default CardItem;