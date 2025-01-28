import {FormEvent, useState} from "react";
import toast from "react-hot-toast";
import {myFetch} from "../../utils/myFetch.ts";
import {useQueryClient} from "react-query";

const PageCreatePrice = () => {
    const queyrClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(false);


    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const title_input = document.getElementById('title') as HTMLInputElement;
        const description_input = document.getElementById('description') as HTMLInputElement;

        if (
            !title_input.value
            ||
            !description_input
        ) return;


        toast.promise(
            myFetch({
                endpoint: "/services/create",
                method: "post",
                data: {title: title_input.value, description: description_input.value},
            }),
            {
                loading: "Загрузка!",
                success: "Успешно завершено!",
                error: "Произошла ошибка!",
            }
        )
            .then(() => {
                queyrClient.invalidateQueries('price')
                title_input.value = "";
                description_input.value = "";
            })
            .finally(() => {
                setIsLoading(false);
            })
    }


    return (
        <form onSubmit={onSubmit} className={"pb-[100px]"}>
            <div className={"w-[90%] mx-auto sm:w-[500px] md:w-[600px] lg:w-[800px] xl:w-[1000px]"}>
                <input
                    id={"title"}
                    className={"w-full mb-[10px] border border-[#9C9C9C] p-[12px] bg-transparent text-white outline-none lg:mb-[40px] lg:py-[26px] lg:px-[34px]"}
                    type="text"
                    placeholder={"Название"}
                />
                <textarea
                    id={"description"}
                    className={"w-full border border-[#9C9C9C] bg-transparent p-[12px] text-white outline-none mb-[41px] lg:py-[26px] lg:px-[34px]"}
                    placeholder={"Описание"}
                    rows={10}
                />
            </div>
            <button
                disabled={isLoading}
                className={"w-[90%] block mx-auto border-[3px] border-[#D8A227] py-[19px] rounded-[10px] text-xl font-medium text-white min-[400px]:w-[340px]"}>
                Добавить услугу
            </button>
        </form>
    )
}

export default PageCreatePrice;