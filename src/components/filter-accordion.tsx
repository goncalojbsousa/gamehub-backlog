import React, { useState } from 'react';

interface AccordionProps {
    title: string;
    filters: string[];
    selectedFilters: string[];
    handleFilterChange: (filter: string) => void;
}

export const Accordion: React.FC<AccordionProps> = ({ title, filters, selectedFilters, handleFilterChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    const handleFilterClick = (filter: string) => {
        handleFilterChange(filter);
    };

    return (
        <div className="rounded-lg p-4 pt-0">
            <h2
                className={`flex justify-between cursor-pointer ${isOpen ? 'text-color_text' : 'text-color_text_sec'} hover:text-color_text select-none`}
                onClick={toggleAccordion}
            >
                {title}
                <span className="">{isOpen ? '▲' : '▼'}</span>
            </h2>
            {isOpen && (
                <div className="mt-4 max-h-60 overflow-y-auto">
                    {filters.map((filter) => (
                        <div
                            key={filter}
                            className={`flex items-center p-2 rounded-lg cursor-pointer ${selectedFilters.includes(filter) ? 'bg-color_main' : 'hover:bg-color_main'}`}
                            onClick={() => handleFilterClick(filter)}
                        >
                            <input
                                type="checkbox"
                                id={`${title}-${filter}`}
                                checked={selectedFilters.includes(filter)}
                                onChange={() => handleFilterClick(filter)}
                                className="peer hidden"
                            />
                            <div className="w-5 h-5 flex items-center justify-center border-2 border-border_detail rounded-lg peer-checked:border-transparent">
                                <svg
                                    className={`w-4 h-4 ${selectedFilters.includes(filter) ? 'block' : 'hidden'} text-color_text`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <label
                                htmlFor={`${title}-${filter}`}
                                className="ml-3 flex-1"
                            >
                                {filter}
                            </label>
                        </div>
                    ))}
                </div>
            )}
            <hr className='mt-2 border-border_detail' />
        </div>
    );
};

export default Accordion;
