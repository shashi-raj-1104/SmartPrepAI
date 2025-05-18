import React from 'react'
import { LuX } from 'react-icons/lu'

const Drawer = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  return (
    <div
      className={`fixed top-[64px] right-0 z-40 h-[calc(100dvh-64px)] p-4 transition-transform bg-white w-full md:w-[40vw] shadow-2xl shadow-cyan-800/10 border-l border-gray-200 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      tabIndex="-1"
      aria-labelledby="drawer-right-label"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h5 id="drawer-right-label" className="text-base font-semibold text-black">
          {title}
        </h5>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex items-center justify-center"
        >
          <LuX className="text-lg" />
        </button>
      </div>

      {/* Scrollable Drawer Body */}
      <div className="text-sm mx-1 overflow-y-auto max-h-[calc(100vh-140px)] pr-2">
        {children}
      </div>
    </div>
  );
};

export default Drawer;
