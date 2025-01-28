'use client'

import {useEffect, useRef, useState} from "react";


interface IProps {
    isDark: boolean,
    itemNumber: number,
    title: string,
    description: string,
    zIndex: number,
}



const FAQItem = ({isDark, itemNumber, title, description, zIndex}: IProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const itemRef = useRef<HTMLDivElement>(null)


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (itemRef.current && !itemRef.current.contains(event.target as Node)) setIsOpen(false);
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [])


    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(true)}
                className={`${isOpen ? "rounded-t-[10px]" : "rounded-[10px]"} ${isDark ? "bg-[var(--darkBlue)] border-[#D8A227]" : "bg-[#D8A227] border-black/20"} border-[2px] md:border-[3px] transition-all text-start
                font-medium text-2xl px-[13px] py-[4px] w-full h-full min-h-[85px] flex items-center gap-x-[10px] sm:min-h-[90px] md:gap-x-[20px] lg:min-h-[111px]`}>
                <span
                    className={`${isDark ? "text-[#D8A227]" : "text-[var(--darkBlue)]"} font-bold text-4xl sm:text-5xl lg:text-6xl`}>
                    {itemNumber > 9 ? itemNumber : `0${itemNumber}`}
                </span>
                <span className={"text-lg font-medium sm:text-2xl"}>
                    {title}
                </span>
            </button>
            <div className={`${isOpen ? "block" : "hidden"} absolute inset-0 cursor-pointer`}></div>
            <div
                style={{zIndex}}
                className={`${isOpen ? "max-h-[340px]" : "max-h-0"} ${isDark ? "bg-[var(--darkBlue)]" : "bg-[#D8A227]"} rounded-b-[10px] transition-all duration-[400ms] absolute w-full left-0 overflow-hidden`}
            >
                <p ref={itemRef}
                   className={`${isDark ? "border-[#D8A227]" : "border-black/20"} text-sm top-full p-[8px] border-x-[3px] border-b-[3px] rounded-b-[10px] sm:text-base sm:p-[10px] md:p-[14px] md:text-lg lg:text-xl`}>
                    {description}
                </p>
            </div>
        </div>
    )
}

export default FAQItem