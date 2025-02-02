import {Dispatch, SetStateAction} from "react";
import {closestCenter, DndContext, DragEndEvent} from "@dnd-kit/core";
import {arrayMove, rectSortingStrategy, SortableContext} from "@dnd-kit/sortable";
import {ISolutionItem} from "./index.tsx";
import MnFAQItem from "./MnFAQItem.tsx";


interface IProps {
    index: number;
    image: string;
    title: string;
    width: number;
    height: number;
    currentLng: string;
    statisticListLength: number;
    items: ISolutionItem[];
    setItems: Dispatch<SetStateAction<ISolutionItem[]>>;
    setIsChangedSort: Dispatch<SetStateAction<boolean>>
}


export const CategorySection = (
    {
        index,
        image,
        title,
        width,
        height,
        currentLng,
        statisticListLength,
        items,
        setItems,
        setIsChangedSort
    }: IProps
) => {


    const handleDragEnd = (event: DragEndEvent) => {
        if (!items) return;

        const {active, over} = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex(card => card._id === active.id);
            const newIndex = items.findIndex(card => card._id === over.id);
            const sortedArray = arrayMove(items, oldIndex, newIndex);
            setItems(sortedArray);
            setIsChangedSort(true)
        }
    };


    return (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map(card => card._id)} strategy={rectSortingStrategy}>
                <li className={"mb-[30px]"}>
                    <div
                        className={"flex items-center gap-[10px] flex-col lg:flex-row mb-[14px] lg:mb-0"}
                    >
                        <div
                            className={`w-[100px] h-[100px] rounded-full flex justify-center items-center bg-white/10 p-[18px] sm:w-[130px] sm:h-[130px] sm:p-[24px] lg:w-[120px] lg:h-[120px]
                                xl:w-[180px] xl:h-[180px]`}>
                            <img
                                className={`${
                                    index === 0
                                        ? "xl:w-[118px] xl:h-[113px]"
                                        : index === 1
                                            ? "xl:w-[123px] xl:h-[115px]"
                                            : "xl:w-[122px] xl:h-[122px]"
                                }                                    
                                    w-full h-full object-center object-cover`}
                                src={image}
                                alt={title}
                                width={width}
                                height={height}
                            />
                        </div>
                        <span
                            className={"font-medium text-lg flex-1 sm:text-center lg:text-start lg:text-xl xl:text-2xl"}>{title}</span>
                    </div>
                    <div className={"grid gap-[8px] mt-[10px] xl:mt-[16px]"}>
                        {items.map((i_item, i_index) => (
                            <MnFAQItem
                                title={
                                    currentLng === 'ru'
                                        ? i_item.title
                                        : currentLng === 'uz'
                                            ? i_item.title_uz || i_item.title
                                            : i_item.title_en || i_item.title
                                }
                                description={
                                    currentLng === 'ru'
                                        ? i_item.description
                                        : currentLng === 'uz'
                                            ? i_item.description_uz || i_item.description
                                            : i_item.description_en || i_item.description
                                }
                                key={i_item._id}
                                zIndex={11 + statisticListLength - i_index}
                                isYellow={i_index % 2 == 0}
                                id={i_item._id}
                                setItems={setItems}
                            />
                        ))}
                    </div>
                </li>
            </SortableContext>
        </DndContext>
    )
}