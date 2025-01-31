import {BtnFlags} from "../../components/BtnFlags.tsx";
import {useQueryClient} from "react-query";
import {ChangeEvent, FormEvent, useState} from "react";
import toast from "react-hot-toast";
import {myFetch} from "../../utils/myFetch.ts";
import {errorHandler} from "../../utils/errorHandler.ts";
import {IconImage} from "../../components/Icons.tsx";


type FormDataType = {
    title: string;
    title_uz: string;
    title_en: string;
    description: string;
    description_uz: string;
    description_en: string;
};

const initialFormData: FormDataType = {
    title: "",
    title_uz: "",
    title_en: "",
    description: "",
    description_uz: "",
    description_en: "",
}


const PageCreateProject = () => {
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(false);
    const [currentLng, setCurrentLng] = useState("ru");
    const [formData, setFormData] = useState<FormDataType>(initialFormData);
    const [image, setImage] = useState<File | null | undefined>();


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

        if (!formData.title || !formData.description) {
            toast.error("Введите название и описание на русском языке!");
            return
        }

        if (!image) {
            toast.error("Вставить изображение!")
            return;
        }

        const fData = new FormData()
        fData.append("image", image)

        for (const key in formData) {
            if (formData.hasOwnProperty(key)) {
                fData.append(key, formData[key as keyof typeof formData]);
            }
        }


        toast.promise(
            myFetch({
                endpoint: "/projects/create",
                method: "post",
                data: fData,
                cType: "multipart/form-data"
            }),
            {
                loading: "Загрузка!",
                success: "Успешно завершено!",
                error: "Произошла ошибка!",
            }
        )
            .then(() => {
                queryClient.invalidateQueries('projects')
                setFormData(initialFormData)
                setImage(null)
            })
            .catch(error => errorHandler(error))
            .finally(() => {
                setIsLoading(false);
            })
    }


    return (
        <div>
            <h2 className={"main_title"}>Добавить Проект</h2>
            <form onSubmit={onSubmit} className={"mb-[100px]"}>

                <input
                    type="file"
                    accept={"image/*"}
                    hidden
                    id="image"
                    value={''}
                    onChange={e => setImage(e.target.files?.[0])}
                />

                <label
                    htmlFor="image"
                    className={`text-center text-white mb-[30px] overflow-hidden w-[140px] h-[100px] mx-auto rounded shadow border border-black/10 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center
                    lg:w-[180px] lg:h-[120px]`}
                >
                    {
                        !!image
                            ? <img src={URL.createObjectURL(image)} alt="image"
                                   className={"w-full h-full object-center object-cover"}/>
                            : <IconImage className={"w-[50px] h-auto"}/>
                    }

                </label>

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

export default PageCreateProject;