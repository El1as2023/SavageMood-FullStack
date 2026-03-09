'use client'

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { question_list } from '@/assets/assets'; // Перевірте шлях!

const Faq = () => {
    const [openIndex, setOpenIndex] = useState<string[]>([]);

    const toggleAccordion = (id: string) => {
        setOpenIndex((prevIndexes) => {
            if (prevIndexes.includes(id)) {
                return prevIndexes.filter((item) => item !== id);
            } else {
                return [...prevIndexes, id];
            }
        });
    };

    return (
        <section className="relative pt-16 bg-[#0f1418] border-t border-white/5">
            <div className="container mx-auto px-6">

                {/* Заголовок */}
                <h2 className="pb-5 text-3xl md:text-5xl font-bold text-center text-white mb-16 font-orbitron uppercase tracking-wider">
                    Часті <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7777f6] to-[#a4a4f4]">запитання</span>
                </h2>

                {/* --- ВИПРАВЛЕННЯ ТУТ: md:grid-cols-2 (раніше було lg) --- */}
                <div className="sm:grid grid-cols-1 md:grid grid-cols-2 gap-6 items-start pb-10">
                    {question_list.map((question) => {
                        const isOpen = openIndex.includes(question._id);

                        return (
                            <article
                                key={question._id}
                                onClick={() => toggleAccordion(question._id)}
                                className={`
                                    group flex flex-col p-6 rounded-2xl cursor-pointer border transition-all duration-300
                                    ${isOpen
                                    ? 'bg-[#1f2830] border-[#7777f6] shadow-[0_0_20px_rgba(119,119,246,0.2)]'
                                    : 'bg-[#141f1f] border-white/10 hover:border-[#7777f6]/50 hover:bg-[#1a2329]'
                                }
                                `}
                            >
                                <div className="flex items-start gap-4 justify-between w-full">
                                    {/* Питання */}
                                    <h4 className={`
                                        text-lg font-bold font-orbitron leading-snug transition-colors duration-300 flex-1
                                        ${isOpen ? 'text-[#7777f6]' : 'text-gray-100 group-hover:text-white'}
                                    `}>
                                        {question.question}
                                    </h4>

                                    {/* Іконка */}
                                    <div className={`
                                        flex-shrink-0 mt-1 transition-transform duration-300
                                        ${isOpen ? 'text-[#7777f6] rotate-180' : 'text-gray-500 group-hover:text-[#7777f6]'}
                                    `}>
                                        {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                                    </div>
                                </div>

                                {/* Відповідь */}
                                <div className={`
                                    grid transition-all duration-300 ease-in-out
                                    ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}
                                `}>
                                    <div className="overflow-hidden">
                                        <p className="text-gray-400 text-sm leading-relaxed pr-4 border-t border-white/5 pt-4">
                                            {question.answer}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default Faq;