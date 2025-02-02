import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {useNavigate, useParams} from "react-router-dom";
import {BASE_URL} from "../../utils/constants.ts";
import Loading from "../../components/Loading.tsx";
import {BtnFlags} from "../../components/BtnFlags.tsx";
import {errorHandler} from "../../utils/errorHandler.ts";


interface IData {
    title: string;
    title_uz?: string;
    title_en?: string;
    description: string;
    description_uz?: string;
    description_en?: string;
}

const initialFormData = {
    title: "",
    description: "",
    title_uz: "",
    description_uz: "",
    title_en: "",
    description_en: "",
}


const PagePriceEdit = () => {
    const {id} = useParams()
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [currentLng, setCurrentLng] = useState("ru");
    const [formData, setFormData] = useState<IData>(initialFormData);
    const [isUpdating, setIsUpdating] = useState(false);


    useEffect(() => {
        axios.get(BASE_URL + '/services/' + id)
            .then(res => {
                setFormData(res.data);
            })
            .catch(() => {
                toast.error("Произошла ошибка!")
            })
            .finally(() => {
                setIsLoading(false);
            })
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


        setIsUpdating(true)
        toast.promise(
            axios.put(BASE_URL + '/services/edit/' + id, formData, {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}}),
            {
                loading: "Загрузка!",
                success: "Успешно завершено!",
                error: "Произошла ошибка!",
            }
        )
            .then(() => {
                setFormData(initialFormData)
                navigate('/price')
            })
            .catch(error => errorHandler(error))
            .finally(() => {
                setIsUpdating(false)
            })
    }


    return (
        <div>
            {isLoading && <Loading/>}
            <div>
                <h2 className={"main_title"}>Редактировать Услуги</h2>
                <BtnFlags
                    currentLng={currentLng}
                    changeLng={changeLng}
                />
                <form onSubmit={onSubmit} className={"pb-[100px]"}>
                    <div className={"w-[90%] mx-auto sm:w-[500px] md:w-[600px] lg:w-[800px] xl:w-[1000px]"}>
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
                            id={"title"}
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
                            id={"description"}
                            className={"w-full border border-[#9C9C9C] bg-transparent p-[12px] text-white outline-none mb-[41px] lg:py-[26px] lg:px-[34px]"}
                            placeholder={"Описание"}
                            rows={10}
                        />
                    </div>
                    <button
                        disabled={isLoading || isUpdating}
                        className={"w-[90%] block mx-auto border-[3px] border-[#D8A227] py-[19px] rounded-[10px] text-xl font-medium text-white min-[400px]:w-[340px]"}>
                        Сохранять
                    </button>
                </form>
            </div>
        </div>
    )
}

export default PagePriceEdit;