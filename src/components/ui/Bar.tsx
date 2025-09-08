'use client';
import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

interface BarProps {
    onToggle: () => void;
    isOpen: boolean;
}

const Bar: React.FC<BarProps> = ({ onToggle, isOpen }) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        const close = (e: MouseEvent) => {
            if (isOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onToggle();
                setSelectedCategory(null);
            }
        };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, [isOpen, onToggle]);

    const category = [
        { id: "1", name: "Dresess", children: ['Evening', 'Casual', 'Maxi'] },
        { id: "2", name: "Trousers", children: ['Wide Leg', 'Straight', 'Cropped'] },
        { id: "3", name: "Tops", children: ['Blouses', 'T-Shirts', 'Tanks'] },
        { id: "4", name: "Skirts", children: ['Mini', 'Midi', 'Maxi'] },
        { id: "5", name: "Coats", children: ['Trench', 'Puffer', 'Wool'] },
    ];
    const selected = category.find(cat => cat.id === selectedCategory);

    return (
        <div>
            <div onClick={onToggle} className="cursor-pointer relative z-50">
                <Image src="/img/bar.svg" alt="Bar" width={20} height={20} />
            </div>
            <div
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
            />

            <div
                ref={menuRef}
                className={`bg-white w-[300px] max-[768px]:w-[100%] h-full fixed top-0 right-0 z-50 transform transition-transform duration-300 
                ${isOpen ? '-translate-x-0' : 'translate-x-full'}`}>

                {selectedCategory === null && (
                    <div className="w-full h-[56px] items-center pl-[20px] pr-[20px] flex justify-between">
                      
                        <h2 className="font-bold text-[30px] uppercase tracking-[1px]">Etor</h2>
                        <Image src="/img/fa-x.svg" alt="Close" width={16} height={16} onClick={onToggle} />
                    </div>
                )}

                <div className="w-full pr-[16px] h-full">
                    <div className="w-full bg-white h-full">
                        <div className="w-full pl-[14px] pt-[10px]">
                            {selectedCategory === null ? (
                                <ul className="flex flex-col gap-y-3 px-1 py-2">
                                    {category.map((item) => (
                                        <li
                                            key={item.id}
                                            onClick={() => setSelectedCategory(item.id)}
                                            className="flex items-center justify-between w-full "
                                        >
                                            <span className='text-[18px]    pt-[3px] text-[#1a1a1a]'>{item.name}</span>
                                            <Image
                                                src="/img/right.svg"
                                                alt="Arrow"
                                                width={14}
                                                height={14}
                                                className="rotate-[-90deg]"
                                            />
                                        </li>
                                    ))}
                                </ul>
                            ) : (

                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between h-[40px] gap-2 px-1 py-2">
                                        <button
                                            onClick={() => setSelectedCategory(null)}
                                            className="text-gray-500 hover:text-black text-lg"
                                            aria-label="Back"
                                        >
                                            <Image
                                                src="/img/right.svg"
                                                alt="Arrow"
                                                width={10}
                                                height={10}
                                                className="rotate-[90deg]"
                                            />

                                        </button>
                                        <h3 className="text-lg font-semibold">{selected?.name}</h3>
                                        <Image src="/img/fa-x.svg" alt="Close" width={16} height={16} onClick={onToggle} />

                                    </div>
                                    <ul className="flex flex-col gap-y-2">
                                        {selected?.children.map((child, idx) => (
                                            <li
                                                key={idx}
                                                className="text-gray-700 hover:text-black cursor-pointer"
                                            >
                                                {child}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Bar;
