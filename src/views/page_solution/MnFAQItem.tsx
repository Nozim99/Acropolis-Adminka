import {Dispatch, SetStateAction, useEffect, useRef, useState} from "react";
import toast from "react-hot-toast";
import axios from "axios";
import {Link} from "react-router-dom";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {IconDelete, IconDod3, IconEdit, IconLine2} from "../../components/Icons.tsx";
import DeleteModal from "../../components/DeleteModal.tsx";
import {BASE_URL} from "../../utils/constants.ts";
import {ISolutionItem} from "./index.tsx";

const MnFAQItem = (
    {
        isYellow = true,
        title,
        description,
        zIndex,
        id,
        setItems,
    }: {
        isYellow: boolean,
        title: string,
        description: string[],
        zIndex: number,
        id: string;
        setItems: Dispatch<SetStateAction<ISolutionItem[]>>
    }) => {
    const editRef = useRef<HTMLDivElement>(null)
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState(false)
    const itemRef = useRef<HTMLDivElement>(null)
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id});
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (itemRef.current && !itemRef.current.contains(event.target as Node)) setIsOpen(false);
            if (editRef.current && !editRef.current.contains(event.target as Node)) setIsEditOpen(false);
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [])


    const deleteSolution = () => {
        const token = localStorage.getItem("token")

        setIsDeleting(true);
        toast.promise(
            axios.delete(BASE_URL + '/solutions/' + id, {headers: {Authorization: `Bearer ${token}`}}),
            {
                loading: "Loading...",
                success: "Удалено",
                error: "Произошла ошибка.",
            }
        )
            .then(() => {
                setItems(prev => prev.filter(item => item._id !== id))
            })
            .finally(() => {
                setIsDeleting(false)
                setDeleteModal(false)
            })
    }


    return (
        <div ref={setNodeRef} style={style} className="relative">
            {
                deleteModal &&
                <DeleteModal
                    closeModal={() => setDeleteModal(false)}
                    deleteHandler={deleteSolution}
                />
            }
            <div className={"relative"}>
                <div
                    style={{zIndex: 11 + (zIndex || 0)}}
                    className={"absolute top-1/2 -translate-y-1/2 right-[15px] flex items-center gap-[10px] z-10"}
                >
                    <div className={"absolute top-1/2 -translate-y-1/2 right-[50px] flex items-center justify-center"}>
                        <button onClick={() => setIsEditOpen(true)}
                                disabled={isDeleting}
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
                                onClick={() => setDeleteModal(true)}
                                className={"px-[30px] py-[8px] hover:bg-black/20 transition-all duration-300 flex items-center gap-[6px]"}>
                                <IconDelete className={"w-[20px] h-auto"}/>
                                <span>Удалить</span>
                            </button>
                            <hr/>
                            <Link
                                to={'/edit-solution/' + id}
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
                <button
                    onClick={() => setIsOpen(true)}
                    className={`${isOpen ? "rounded-t-[10px]" : "rounded-[10px]"} ${isYellow ? "bg-[#D8A227]" : "bg-[#979797]"} transition-all text-start font-medium text-base px-[13px] py-[2px] w-full h-full 
                min-h-[60px] sm:text-lg md:text-xl xl:text-2xl lg:py-[4px] lg:min-h-[67px] line-clamp-2 pr-[28px]`}
                >
                    {title}
                </button>
            </div>
            <div className={`${isOpen ? "block" : "hidden"} absolute inset-0 cursor-pointer`}></div>
            <div
                style={{zIndex: 11 + (zIndex || 0)}}
                className={`${isOpen ? "max-h-[340px]" : "max-h-0"} ${isYellow ? "bg-[#D8A227]" : "bg-[#979797]"} transition-all duration-[400ms] absolute w-full left-0 rounded-b-[10px] overflow-hidden`}
            >
                <div ref={itemRef}
                     className={`text-sm sm:text-base md:text-lg xl:text-xl top-full p-[8px] sm:p-[10px] md:p-[14px] border-t-[2px]`}>
                    {
                        description?.map((d_item, index) => (
                            <p key={index}>
                                {d_item}
                            </p>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default MnFAQItem