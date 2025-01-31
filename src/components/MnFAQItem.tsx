import {useEffect, useRef, useState} from "react";
import {IconDelete} from "./Icons.tsx";
import DeleteModal from "./DeleteModal.tsx";
import toast from "react-hot-toast";
import axios from "axios";
import {BASE_URL} from "../utils/constants.ts";
import {useQueryClient} from "react-query";

const MnFAQItem = (
    {
        isYellow = true,
        title,
        description,
        zIndex,
        id,
    }: {
        isYellow: boolean,
        title: string,
        description: string[],
        zIndex: number,
        id: string;
    }) => {
    const queryClient = useQueryClient();
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState(false)
    const itemRef = useRef<HTMLDivElement>(null)


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (itemRef.current && !itemRef.current.contains(event.target as Node)) setIsOpen(false);
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
                queryClient.invalidateQueries('solutions')
            })
            .finally(() => {
                setIsDeleting(false)
                setDeleteModal(false)
            })
    }


    return (
        <div className="relative">
            {
                deleteModal &&
                <DeleteModal
                    closeModal={() => setDeleteModal(false)}
                    deleteHandler={deleteSolution}
                />
            }
            <div className={"relative"}>
                <button
                    disabled={isDeleting}
                    className={"absolute top-1/2 -translate-y-1/2 right-[15px]"}
                    onClick={() => {
                        setDeleteModal(true)
                    }}
                >
                    <IconDelete/>
                </button>
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