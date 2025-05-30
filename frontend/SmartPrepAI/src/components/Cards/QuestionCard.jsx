import React, { useEffect, useRef, useState } from 'react';
import {
  LuChevronDown,
  LuPin,
  LuPinOff,
  LuSparkles,
  LuTrash2
} from 'react-icons/lu';
import AIResponsePreview from '../../pages/InterviewPrep/components/AIResponsePreview';

const QuestionCard = ({
  question,
  answer,
  isPinned,
  onTogglePin,
  onLearnMore,
  onDelete
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [height, setHeight] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    if (isExpanded) {
      const contentHeight = contentRef.current.scrollHeight;
      setHeight(contentHeight + 10);
    } else {
      setHeight(0);
    }
  }, [isExpanded]);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div>
      <div className="bg-white rounded-lg mb-4 overflow-hidden py-4 px-5 shadow-xl shadow-gray-100/70 border border-gray-100/60 group relative">
        <div className="flex items-start justify-between">
          {/* Question */}
          <div
            className="flex items-start gap-3.5 cursor-pointer"
            onClick={toggleExpand}
          >
            <span className="text-xs md:text-[15px] font-semibold text-gray-400 leading-[18px]">
              Q
            </span>
            <h3 className="text-xs md:text-[14px] font-medium text-gray-800 mr-0 md:mr-20">
              {question}
            </h3>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end ml-4 space-x-2">
            <button
              className="flex items-center gap-2 text-xs text-indigo-800 font-medium bg-indigo-50 px-3 py-1 rounded border hover:border-indigo-200"
              onClick={onTogglePin}
            >
              {isPinned ? <LuPinOff /> : <LuPin />}
            </button>

            <button
              className="flex items-center gap-2 text-xs text-cyan-800 font-medium bg-cyan-50 px-3 py-1 rounded border hover:border-cyan-200"
              onClick={() => {
                setIsExpanded(true);
                onLearnMore();
              }}
            >
              <LuSparkles />
              <span className="hidden md:block">Explain</span>
            </button>

            <button
              className="flex items-center gap-2 text-xs text-rose-500 font-medium bg-rose-50 px-3 py-1 rounded border hover:border-rose-200"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Are you sure you want to delete this question?')) {
                  onDelete();
                }
              }}
            >
              <LuTrash2 />
            </button>

            <button
              className="text-gray-400 hover:text-gray-500"
              onClick={toggleExpand}
            >
              <LuChevronDown
                size={20}
                className={`transform transition-transform duration-300 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>
        </div>

        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{ maxHeight: `${height}px` }}
        >
          <div
            className="mt-4 text-gray-700 bg-gray-50 px-5 py-5 rounded-lg"
            ref={contentRef}
          >
            <AIResponsePreview content={answer} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
