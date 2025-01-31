import CardItem from "../../components/CardItem.tsx";
import useMainFetch from "../../hooks/useMainFetch.ts";
import {BtnFlags} from "../../components/BtnFlags.tsx";
import {useState} from "react";
import Loading from "../../components/Loading.tsx";
import MButton from "../../components/MButton.tsx";


interface ResType {
    data?: {
        title: string;
        title_uz?: string;
        title_en?: string;
        description: string;
        description_uz?: string;
        description_en?: string;
        image: {
            url: string;
        }
        _id: string;
    }[];
    isLoading: boolean;
}

const PageProjects = () => {
    const [currentLng, setCurrentLng] = useState("ru");

    const {data, isLoading}: ResType = useMainFetch({
        key: 'projects',
        endpoint: "/projects",
        generateData: (res: any) => res?.data?.projects || []
    })


    return (
        <div>
            {
                isLoading &&
                <Loading/>
            }
            <h2 className={"main_title"}>Проекте</h2>
            <BtnFlags
                changeLng={(lng: string) => setCurrentLng(lng)}
                currentLng={currentLng}
            />
            <div
                className={"mx-auto grid grid-cols-1 gap-y-[25px] pt-[20px] pb-[41px] relative sm:grid-cols-2 sm:pt-[30px] md:pt-[35px] lg:w-[900px] lg:gap-x-[20px] xl:w-[1047px] xl:gap-x-[10px]"}
            >
                {data?.map((project, index) => (
                    <CardItem
                        key={index}
                        title={
                            currentLng === 'ru'
                                ? project.title
                                : currentLng === 'uz'
                                    ? project.title_uz || project.title
                                    : project.title_en || project.title
                        }
                        description={
                            currentLng === 'ru'
                                ? project.description
                                : currentLng === 'uz'
                                    ? project.description_uz || project.description
                                    : project.description_en || project.description
                        }
                        image={project.image.url}
                        id={project._id}
                    />
                ))}
            </div>
            <MButton pathname={'/create-project'}>
                Добавить
            </MButton>
        </div>
    )
}

export default PageProjects;