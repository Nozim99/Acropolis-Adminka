import {Link} from "react-router-dom";

const PageHome = () => {
    return (
        <div className={"text-4xl font-light grid gap-y-[33px] md:grid-cols-2 md:w-[640px] md:mx-auto lg:w-[970px] xl:w-[1000px] lg:text-5xl"}>
            <Link to={"/price"} className={"relative h-[168px] rounded-[5px] bg-white w-[80%] mx-auto px-[14px] py-[3px] min-[420px]:w-[336px] md:w-[300px] lg:w-[452px] lg:h-[309px] lg:px-[24px] lg:py-[18px]"}>
                <h2>Услуги</h2>
                <img
                    className={"absolute bottom-0 right-[12px] lg:w-[306px] lg:h-[213px] lg:bottom-[30px] lg:right-[22px]"}
                    src="/images/developers.png"
                    alt="image"
                    width={159}
                    height={121}
                />
            </Link>

            <Link to={"/clients"} className={"relative h-[168px] rounded-[5px] bg-white w-[80%] mx-auto px-[14px] py-[3px] min-[420px]:w-[336px] md:w-[300px] lg:w-[452px] lg:h-[309px] lg:px-[24px] lg:py-[18px]"}>
                <h2>Наши клиенты </h2>
                <img
                    className={"absolute -bottom-[20px] -right-[14px] md:w-[190px] md:h-auto lg:w-[400px] lg:right-[20px] lg:bottom-0"}
                    src="/images/groups.png"
                    alt="image"
                    width={159}
                    height={121}
                />
            </Link>
        </div>
    )
}

export default PageHome;