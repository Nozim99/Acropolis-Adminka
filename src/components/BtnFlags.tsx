import {IconEn, IconRu, IconUz} from "./Icons.tsx";


const langs = [
    {
        title: "RU",
        value: "ru",
        icon: IconRu
    },
    {
        title: "UZ",
        value: "uz",
        icon: IconUz
    },
    {
        title: "EN",
        value: "en",
        icon: IconEn
    },
]


interface PropsType {
    changeLng: (lng: string) => void;
    currentLng: string;
}

export const BtnFlags = ({changeLng, currentLng}: PropsType) => {


    return (
        <ul className={"flex items-center justify-center gap-[14px] mb-[20px] sm:gap-[24px] md:mb-[30px]"}>
            {langs.map((lang) => (
                <li
                    key={lang.value}
                    className={`${currentLng === lang.value ? "border-yellow-500" : "border-transparent"} transition-all duration-500 border-b-[2px]  pb-[2px] sm:pb-[4px]`}
                >
                    <button
                        type={"button"}
                        onClick={() => {
                            changeLng(lang.value)
                        }}
                        className={"flex text-white items-center gap-[5px]"}
                    >
                        <span className={"hidden sm:inline-block"}>{lang.title}</span>
                        <lang.icon/>
                    </button>
                </li>
            ))}
        </ul>
    )
}