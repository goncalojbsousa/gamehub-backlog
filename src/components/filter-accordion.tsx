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
        <div className="rounded-lg p-4 pt-0 transition-all duration-200 hover:bg-color_main/5">
            <h2
                className={`flex justify-between cursor-pointer transition-all duration-200 ${isOpen ? 'text-color_text' : 'text-color_text_sec'} hover:text-color_text select-none`}
                onClick={toggleAccordion}
            >
                {title}
                <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                    ▼
                </span>
            </h2>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="mt-4 space-y-1">
                    {filters.map((filter, index) => (
                        <div
                            key={filter}
                            className={`flex items-center p-2 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-[1.02] hover:shadow-sm ${
                                selectedFilters.includes(filter) 
                                    ? 'bg-color_main shadow-sm scale-[1.01]' 
                                    : 'hover:bg-color_main/50'
                            }`}
                            onClick={() => handleFilterClick(filter)}
                            style={{
                                animationDelay: `${index * 50}ms`,
                                animation: isOpen ? 'slideInUp 0.3s ease-out forwards' : 'none'
                            }}
                        >
                            <input
                                type="checkbox"
                                id={`${title}-${filter}`}
                                checked={selectedFilters.includes(filter)}
                                onChange={() => handleFilterClick(filter)}
                                className="peer hidden"
                            />
                            <div className={`w-5 h-5 flex items-center justify-center border-2 rounded-lg transition-all duration-200 ${
                                selectedFilters.includes(filter) 
                                    ? 'border-color_accent bg-color_accent' 
                                    : 'border-border_detail hover:border-color_accent/50'
                            }`}>
                                {selectedFilters.includes(filter) && (
                                    <span style={{color: 'white', fontSize: '12px'}}>
                                        ✓
                                    </span>
                                )}
                            </div>
                            <label
                                htmlFor={`${title}-${filter}`}
                                className="ml-3 flex-1 transition-colors duration-200"
                            >
                                {filter}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
            <hr className='mt-2 border-border_detail transition-colors duration-200' />
        </div>
    );
};

export default Accordion;
