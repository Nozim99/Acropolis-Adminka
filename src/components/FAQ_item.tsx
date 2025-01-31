import {useEffect, useRef, useState} from "react";
import {BASE_URL} from "../utils/constants.ts";
import axios from "axios";
import toast from "react-hot-toast";
import {useQueryClient} from "react-query";
import DeleteModal from "./DeleteModal.tsx";


interface IProps {
    isDark: boolean,
    itemNumber: number,
    title: string,
    description: string,
    zIndex: number,
    id: string
}


const FAQItem = ({isDark, itemNumber, title, description, zIndex, id}: IProps) => {
    const queryClient = useQueryClient()
    const [isOpen, setIsOpen] = useState(false)
    const [modal, setModal] = useState(false)
    const itemRef = useRef<HTMLDivElement>(null)


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (itemRef.current && !itemRef.current.contains(event.target as Node)) setIsOpen(false);
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [])

    const deleteItem = () => {
        const token = localStorage.getItem("token")

        toast.promise(
            axios.delete(BASE_URL + '/services/' + id, {headers: {Authorization: `Bearer ${token}`}}),
            {
                loading: "Loading...",
                success: "Удалено",
                error: "Произошла ошибка.",
            }
        )
            .then(() => {
                queryClient.invalidateQueries('price')
            })
        setModal(false)
    }


    return (
        <div>
            {
                modal &&
                <DeleteModal
                    closeModal={() => setModal(false)}
                    deleteHandler={deleteItem}
                />
            }
            <div className={"flex items-center gap-[20px] justify-end mb-[4px]"}>
                <button
                    onClick={() => setModal(true)}
                    className={"flex items-center gap-[4px] px-[10px] py-[3px] rounded-lg  bg-white/10s shadow border border-white/40 text-red-500 hover:bg-red-600 hover:text-white transition-all"}>
                    <span>Удалить</span>
                </button>
            </div>
            <div className="relative">
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

export default FAQItem