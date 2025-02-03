import {useState} from "react";
import toast from "react-hot-toast";
import axios from "axios";
import {CSS} from "@dnd-kit/utilities";
import {useSortable} from "@dnd-kit/sortable";
import {IconLine2} from "../../components/Icons.tsx";
import DeleteModal from "../../components/DeleteModal.tsx";
import {BASE_URL} from "../../utils/constants.ts";

export const ImgCard = (
    {
        image,
        id,
        removeClient
    }:
    {
        image: string;
        id: string;
        removeClient: () => void;
    }
) => {
    const [isLoadingBtn, setIsLoadingBtn] = useState(false)
    const [deleteModal, setDeleteModal] = useState<boolean>(false)
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };


    const deleteItem = (id: string) => {
        const token = localStorage.getItem("token")

        setDeleteModal(false)
        setIsLoadingBtn(true)
        toast.promise(
            axios.delete(BASE_URL + '/clients/' + id, {headers: {Authorization: `Bearer ${token}`}}),
            {
                loading: "Loading...",
                success: "Удалено",
                error: "Произошла ошибка.",
            }
        )
            .then(() => {
                removeClient()
            })
            .finally(() => setIsLoadingBtn(false))
    }


    return (
        <>
            {
                deleteModal &&
                <DeleteModal
                    closeModal={() => setDeleteModal(false)}
                    deleteHandler={() => deleteItem(id)}
                />
            }

            <div ref={setNodeRef} style={style} className={"relative mx-auto bg-[#004040] touch-none"}>
                <div className={"absolute flex items-center gap-[10px] top-[4px] right-[8px]"}>
                    <button
                        onClick={() => setDeleteModal(true)}
                        disabled={isLoadingBtn}
                        className={"text-white bg-neutral-700 hover:bg-neutral-600 px-[10px] py-[2px] rounded text-sm"}>
                        Delete
                    </button>
                    <button
                        {...listeners}
                        {...attributes}
                        className={"w-[30px] h-[30px] border flex items-center justify-center cursor-grab active:cursor-grabbing transition-all rounded bg-black/30"
                        }
                    >
                        <IconLine2/>
                    </button>
                </div>
                <img
                    className={"w-[250px] h-[140px] object-center object-cover shadow border border-black/10"}
                    src={image}
                    alt="image"
                />
            </div>
        </>
    )
}