function Search() {
    return (
        <div className="flex items-center border w-80 focus-within:border-indigo-500 transition duration-300 pr-3 gap-2 bg-white border-gray-500/30 h-[30px] rounded-[5px] overflow-hidden">
            <input
                type="text"
                placeholder="Buscar carpetas o recursos"
                className="w-full h-full pl-4 outline-none placeholder-gray-500 text-sm"
            />
            <span>🚀</span>
        </div>
    );
};

export default Search;