import toast from "react-hot-toast";
import {ChangeEvent, useState} from "react";
import {myFetch} from "../../utils/myFetch.ts";
import {IconClose} from "../../components/Icons.tsx";
import {useQueryClient} from "react-query";

const PageCreateClient = () => {
    const queyrClient = useQueryClient()
    const [isLoading, setIsLoading] = useState(false);
    const [imageFiles, setImageFiles] = useState<File[]>([]);


    const inputHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (files?.length) {
            const newFiles = Array.from(files);
            const uniqueFiles = newFiles.filter(
                file => !imageFiles.some((existingFile => existingFile.lastModified === file.lastModified))
            )
            setImageFiles(prev => [...prev, ...uniqueFiles])
        }
    }

    const removeImageFiles = (lastModified: number) => {
        setImageFiles(prev => prev.filter(file => file.lastModified !== lastModified))
    }

    const onSubmit = () => {
        if (!imageFiles?.length) return;

        const formData = new FormData();
        imageFiles.forEach((file => {
            formData.append('images', file)
        }))

        setIsLoading(true);
        toast.promise(
            myFetch({
                endpoint: "/clients/create",
                method: "post",
                data: formData,
                cType: "multipart/form-data",
            }),
            {
                loading: "Yuklanyabdi",
                success: "Klent yaratildi",
                error: "Xatolik yuz berdi",
            }
        )
            .then(() => {
                queyrClient.invalidateQueries('clients')
                setImageFiles([])
            })
            .finally(() => {
                setIsLoading(false);
            })
    }


    return (
        <div>
            <input
                onChange={inputHandler}
                id={'image_input'}
                type="file"
                multiple
                accept="image/*"
                hidden
                value={""}
            />
            <label
                className={"block cursor-pointer bg-[#D8A227] font-medium text-xl py-[14px] text-black rounded-[15px] w-[75%] mx-auto text-center min-[420px]:py-[18px] min-[420px]:w-[350px] md:w-[480px] md:text-4xl lg:py-[20px]"}
                htmlFor="image_input"
            >
                Загрузить файл
            </label>

            <div className={"container mx-auto flex justify-center text-white gap-[10px] flex-wrap my-[30px]"}>
                {imageFiles?.map((file: File) => (
                    <span
                        key={file.lastModified}
                        className={"border border-white/30 px-[15px] py-[1px] rounded-full flex items-center gap-[8px]"}>
                        <span className={"max-w-[180px] line-clamp-1"}>{file.name}</span>
                        <button
                            onClick={() => removeImageFiles(file.lastModified)}
                        >
                            <IconClose/>
                        </button>
                    </span>
                ))}
            </div>

            <button
                disabled={isLoading}
                className={"font-medium text-xl border-[3px] border-[#D8A227] text-center block mx-auto w-[75%] text-white rounded-[10px] py-[15px] min-[380px]:w-[300px] lg:text-2xl"}
                onClick={onSubmit}
            >
                Добавить клиента
            </button>
        </div>
    )
}

export default PageCreateClient;