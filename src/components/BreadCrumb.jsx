const BreadCrumb = ({ label }) => (
  <div className="flex gap-2 overflow-x-auto no-scrollbar w-full rounded-full px-1 py-1 bg-white backdrop-blur-md border border-white/30 shadow-sm mb-2">
    <button
      className={`px-6 py-3 text-xs lg:text-sm font-medium rounded-full flex items-center gap-2 bg-gradient-to-b from-[#7367F0] to-[#453E90] text-white shadow-md`}
    >
      {label}
    </button>
  </div>
);

export default BreadCrumb;
