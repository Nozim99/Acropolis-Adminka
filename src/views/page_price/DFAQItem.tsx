import {Link} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import toast from "react-hot-toast";
import axios from "axios";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {BASE_URL} from "../../utils/constants.ts";
import DeleteModal from "../../components/DeleteModal.tsx";
import {IconDelete, IconDod3, IconEdit, IconLine2} from "../../components/Icons.tsx";

interface IProps {
    isDark: boolean,
    itemNumber: number,
    title: string,
    description: string,
    zIndex: number,
    id: string;
    removeItem: () => void,
}


export const DFAQItem = ({isDark, itemNumber, title, description, zIndex, id, removeItem}: IProps) => {
    const token = localStorage.getItem("token")
    const editRef = useRef<HTMLDivElement>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [modal, setModal] = useState(false)
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

    const deleteItem = () => {
        toast.promise(
            axios.delete(BASE_URL + '/services/' + id, {headers: {Authorization: `Bearer ${token}`}}),
            {
                loading: "Loading...",
                success: "Удалено",
                error: "Произошла ошибка.",
            }
        )
            .then(() => {
                removeItem()
            })
        setModal(false)
    }


    return (
        <div ref={setNodeRef} style={style}>
            {
                modal &&
                <DeleteModal
                    closeModal={() => setModal(false)}
                    deleteHandler={deleteItem}
                />
            }
            <div className="relative">
                <div style={{zIndex}} className={"absolute top-1/2 -translate-y-1/2 right-[50px] flex items-center justify-center z-10"}>
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
                            to={'/edit-price/' + id}
                            className={"px-[30px] py-[8px] hover:bg-black/20 transition-all duration-300 flex items-center gap-[6px]"}>
                            <IconEdit/>
                            <span>Редактировать</span>
                        </Link>
                    </div>
                </div>
                <button {...listeners} {...attributes}
                        className={"absolute w-[30px] backdrop-blur h-[30px] border flex items-center justify-center cursor-grab active:cursor-grabbing transition-all rounded bg-black/30 top-1/2 -translate-y-1/2 right-[10px]"}>
                    <IconLine2/>
                </button>
                <button
                    onClick={() => setIsOpen(true)}
                    className={`${isOpen ? "rounded-t-[10px]" : "rounded-[10px]"} ${isDark ? "bg-[var(--darkBlue)] border-[#D8A227]" : "bg-[#D8A227] border-black/20"} border-[2px] md:border-[3px] transition-all text-start
                font-medium text-2xl px-[13px] py-[4px] w-full h-full min-h-[85px] flex items-center gap-x-[10px] sm:min-h-[90px] md:gap-x-[20px] lg:min-h-[111px]`}>
                <span
                    className={`${isDark ? "text-[#D8A227]" : "text-[var(--darkBlue)]"} font-bold text-4xl sm:text-5xl lg:text-6xl`}>
                    {itemNumber > 9 ? itemNumber : `0${itemNumber}`}
                </span>
                    <span className={"text-lg font-medium sm:text-2xl"}>
                    {title}
                </span>
                </button>
                <div className={`${isOpen ? "block" : "hidden"} absolute inset-0 cursor-pointer`}></div>
                <div
                    style={{zIndex}}
                    className={`${isOpen ? "max-h-[340px]" : "max-h-0"} ${isDark ? "bg-[var(--darkBlue)]" : "bg-[#D8A227]"} rounded-b-[10px] transition-all duration-[400ms] absolute w-full left-0 overflow-hidden`}
                >
                    <p ref={itemRef}
                       className={`${isDark ? "border-[#D8A227]" : "border-black/20"} text-sm top-full p-[8px] border-x-[3px] border-b-[3px] rounded-b-[10px] sm:text-base sm:p-[10px] md:p-[14px] md:text-lg lg:text-xl`}>
                        {description}
                    </p>
                </div>
            </div>
        </div>
    )
}