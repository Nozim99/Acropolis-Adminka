import {BtnFlags} from "../../components/BtnFlags.tsx";
import {ChangeEvent, FormEvent, useState} from "react";
import toast from "react-hot-toast";
import {myFetch} from "../../utils/myFetch.ts";
import {errorHandler} from "../../utils/errorHandler.ts";
import {useQueryClient} from "react-query";

const categories = [
    {
        title: "ИТ-инфраструктура",
        value: 'it-infrastructure',
    },
    {
        title: "Системное ПО",
        value: 'system-software',
    },
    {
        title: "Информационная безопасность",
        value: 'information-security',
    },
];


const initialFormData = {
    title: "",
    description: "",
    title_uz: "",
    description_uz: "",
    title_en: "",
    description_en: "",
}


const PageCreateSolution = () => {
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(false);
    const [currentLng, setCurrentLng] = useState("ru");
    const [formData, setFormData] = useState(initialFormData);
    const [categoryValue, setCategoryValue] = useState(categories[0].value)


    const changeInputHandler = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const i_name = event.target.name;
        const i_value = event.target.value;

        setFormData(prev => ({
            ...prev,
            [i_name]: i_value
        }))
    }

    const changeLng = (lng: string) => {
        setCurrentLng(lng)
    }

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (
            !formData.title
            ||
            !formData.description
        ) {
            toast.error("Введите название и описание на русском языке!");
            return
        }


        toast.promise(
            myFetch({
                endpoint: "/solutions/create",
                method: "post",
                data: {
                    ...formData,
                    category: categoryValue,
                    description: formData.description.split('\n'),
                    description_uz: formData.description_uz ? formData.description_uz.split('\n') : [],
                    description_en: formData.description_en ? formData.description_en.split('\n') : [],
                },
            }),
            {
                loading: "Загрузка!",
                success: "Успешно завершено!",
                error: "Произошла ошибка!",
            }
        )
            .then(() => {
                queryClient.invalidateQueries('solutions')
                setFormData(initialFormData)
            })
            .catch(error => errorHandler(error))
            .finally(() => {
                setIsLoading(false);
            })
    }


    return (
        <div>
            <h2 className={"main_title"}>Добавить Решения</h2>

            <form onSubmit={onSubmit} className={"mb-[100px]"}>
                <label
                    htmlFor={'category'}
                    className={"block text-center mb-[10px] text-white text-xl md:text-2xl md:mb-[14px]"}
                >
                    Kategoriya
                </label>
                <div className={"flex justify-center mb-[30px]"}>
                    <select
                        onChange={e => setCategoryValue(e.target.value)}
                        className={"text-black px-[14px] py-[10px] rounded outline-0 "}
                        id="category"
                        defaultValue={categories[0].value}
                    >
                        {
                            categories.map(category => (
                                <option
                                    className={""}
                                    value={category.value}
                                    key={category.value}
                                >
                                    {category.title}
                                </option>
                            ))
                        }
                    </select>
                </div>
                <BtnFlags
                    currentLng={currentLng}
                    changeLng={changeLng}
                />
                <div className={"w-[90%] mx-auto sm:w-[500px] md:w-[600px] lg:w-[800px] xl:w-[1000px] mt-[20px]"}>

                    <input
                        onChange={changeInputHandler}
                        name={
                            currentLng === 'ru'
                                ? "title"
                                : currentLng === "uz"
                                    ? "title_uz"
                                    : "title_en"
                        }
                        value={
                            currentLng === 'ru'
                                ? formData.title
                                : currentLng === 'uz'
                                    ? formData.title_uz
                                    : formData.title_en
                        }
                        className={"w-full mb-[10px] border border-[#9C9C9C] p-[12px] bg-transparent text-white outline-none lg:mb-[40px] lg:py-[26px] lg:px-[34px]"}
                        type="text"
                        placeholder={"Название"}
                    />
                    <textarea
                        onChange={changeInputHandler}
                        name={
                            currentLng === 'ru'
                                ? "description"
                                : currentLng === "uz"
                                    ? "description_uz"
                                    : "description_en"
                        }
                        value={
                            currentLng === 'ru'
                                ? formData.description
                                : currentLng === 'uz'
                                    ? formData.description_uz
                                    : formData.description_en
                        }
                        className={"w-full border border-[#9C9C9C] bg-transparent p-[12px] text-white outline-none mb-[41px] lg:py-[26px] lg:px-[34px]"}
                        placeholder={"Описание"}
                        rows={10}
                    />
                </div>
                <button
                    disabled={isLoading}
                    className={"w-[90%] block mx-auto border-[3px] border-[#D8A227] py-[19px] rounded-[10px] text-xl font-medium text-white min-[400px]:w-[340px]"}>
                    Добавить
                </button>
            </form>
        </div>
    )
}

export default PageCreateSolution;