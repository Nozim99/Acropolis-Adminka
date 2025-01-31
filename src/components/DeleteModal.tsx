interface IProps {
    closeModal: () => void;
    deleteHandler: () => void;
}


const DeleteModal = ({closeModal, deleteHandler}: IProps) => (
    <>
        <div onClick={closeModal} className={"fixed z-50 inset-0 bg-black/50 backdrop-blur-[2px]"}></div>
        <div
            className={` fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#D8A227] text-[var(--darkBlue)] w-[300px] py-[14px] rounded-lg z-50 sm:w-[360px] sm:px-[10px] sm:py-[20px] lg:w-[550px] lg:py-[30px]`}>
            <h2 className={"text-lg text-center mb-[18px] font-semibold lg:text-2xl lg:mb-[25px]"}>Вы действительно
                хотите его удалить?</h2>
            <div className={"flex justify-center gap-[14px] lg:text-lg"}>
                <button onClick={closeModal}
                        className={"border border-neutral-900 w-[120px] py-[1px] rounded text-black hover:bg-neutral-800 hover:text-white transition-all duration-300 lg:w-[150px] lg:py-[5px]"}>
                    Отмена
                </button>
                <button
                    onClick={deleteHandler}
                    className={"border border-red-600 w-[120px] py-[1px] rounded text-black hover:bg-red-600 hover:text-white transition-all duration-300 lg:w-[150px] lg:py-[5px]"}
                >
                    Продолжать
                </button>
            </div>
        </div>
    </>
)

export default DeleteModal;