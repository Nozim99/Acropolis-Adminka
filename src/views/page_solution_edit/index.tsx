import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import toast from "react-hot-toast";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import {BtnFlags} from "../../components/BtnFlags.tsx";
import {errorHandler} from "../../utils/errorHandler.ts";
import {BASE_URL} from "../../utils/constants.ts";
import Loading from "../../components/Loading.tsx";


interface IData {
    title: string;
    title_uz?: string;
    title_en?: string;
    description: string[];
    description_uz?: string[];
    description_en?: string[];
    category: 'it-infrastructure' | 'system-software' | 'information-security'
}


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
    title_uz: "",
    title_en: "",
    description: "",
    description_uz: "",
    description_en: "",
}


const PageSolutionEdit = () => {
    const navigate = useNavigate()
    const {id} = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [currentLng, setCurrentLng] = useState("ru");
    const [formData, setFormData] = useState(initialFormData);
    const [categoryValue, setCategoryValue] = useState(categories[0].value)


    useEffect(() => {
        axios.get(BASE_URL + '/solutions/' + id)
            .then(res => {
                const data: IData = res.data?.solution;

                setCategoryValue(data.category);
                setFormData({
                    title: data.title,
                    title_uz: data.title_uz || "",
                    title_en: data.title_en || "",
                    description: data.description.join('\n'),
                    description_uz: data.description_uz?.length ? data.description_uz.join('\n') : "",
                    description_en: data.description_en?.length ? data.description_en.join('\n') : "",
                })
            })
            .finally(() => setIsDataLoading(false))
    }, []);


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
            axios.put(BASE_URL + '/solutions/edit/' + id, {
                    ...formData,
                    category: categoryValue,
                    description: formData.description.split('\n'),
                    description_uz: formData.description_uz ? formData.description_uz.split('\n') : [],
                    description_en: formData.description_en ? formData.description_en.split('\n') : [],
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }),
            {
                loading: "Загрузка!",
                success: "Успешно завершено!",
                error: "Произошла ошибка!",
            }
        )
            .then(() => {
                navigate('/solution')
            })
            .catch(error => errorHandler(error))
            .finally(() => {
                setIsLoading(false);
            })
    }


    return (
        <div>
            {
                isDataLoading && <Loading/>
            }
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
                        value={categoryValue}
                        onChange={e => setCategoryValue(e.target.value)}
                        className={"text-black px-[14px] py-[10px] rounded outline-0 "}
                        id="category"
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

export default PageSolutionEdit;