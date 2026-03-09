'use client'

import { useState } from 'react';
import Link from 'next/link';
import {
    Trophy, AlignLeft, Calendar, Users, Image as ImageIcon,
    Type, ArrowLeft, AlertCircle, UploadCloud
} from 'lucide-react';

import { useCreateTournament } from '@/hooks/useCreateTournament';
import Button from '@/components/ui/Button';

export default function CreateTournamentPage() {
    // Підключаємо наш оновлений хук
    const { createTournament, isLoading, error } = useCreateTournament();

    // Стан для картинки (файл для відправки + URL для показу прев'ю)
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    // Стан для текстових даних форми
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        start: '',
        maxTeamSize: 16,
        prizePoolSize: ''
    });

    // Обробник вибору картинки
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];

            // Опціонально: перевірка на розмір (наприклад, до 5MB)
            if (selectedFile.size > 5 * 1024 * 1024) {
                alert("Файл занадто великий! Максимум 5MB.");
                return;
            }

            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile)); // Генеруємо тимчасове посилання для показу
        }
    };

    // Обробник введення тексту
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'maxTeamSize' ? Number(value) : value
        }));
    };

    // Відправка форми
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createTournament(formData, file);
        } catch (err) {
            console.error("Помилка створення:", err);
            // Помилка вже перехоплена хуком і буде показана в UI
        }
    };

    return (
        <main className="min-h-screen bg-[#0f1418] text-white py-12 px-6">
            <div className="max-w-3xl mx-auto">
                <Link href="/admin" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 text-xs font-bold uppercase tracking-widest">
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>

                <div className="mb-10">
                    <h1 className="text-4xl font-bold font-orbitron uppercase tracking-tighter mb-2">Create Tournament</h1>
                    <p className="text-gray-400">Створи новий турнір. Банер буде завантажено у хмару, а дані синхронізовані з Challonge.</p>
                </div>

                {/* Блок помилки з хука */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-400 mb-8 animate-in fade-in slide-in-from-top-4">
                        <AlertCircle size={20} />
                        <span className="font-bold text-sm">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8 bg-[#141f1f] p-8 rounded-3xl border border-white/5 shadow-2xl">

                    {/* 1. Завантаження Банера */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400">
                            <ImageIcon size={14} className="text-[#7777f6]" /> Tournament Banner
                        </label>

                        <div className={`relative group h-64 w-full bg-[#0f1418] rounded-2xl border-2 border-dashed transition-all overflow-hidden ${preview ? 'border-transparent' : 'border-white/10 hover:border-[#7777f6]/50'}`}>
                            {preview ? (
                                <>
                                    <img src={preview} className="w-full h-full object-cover opacity-80 group-hover:opacity-50 transition-opacity" alt="Preview" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        <span className="bg-black/80 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                            <UploadCloud size={16} /> Change Image
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500 group-hover:text-[#7777f6] transition-colors">
                                    <UploadCloud size={40} className="mb-3" />
                                    <p className="text-xs font-bold uppercase tracking-widest">Click to upload banner</p>
                                    <p className="text-[10px] text-gray-600 mt-2">1920x1080 (Max 5MB)</p>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                required // Робимо банер обов'язковим
                            />
                        </div>
                    </div>

                    {/* 2. Основна Інформація */}
                    <div className="space-y-6 pt-6 border-t border-white/5">
                        <div>
                            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
                                <Type size={14} className="text-[#7777f6]" /> Tournament Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                minLength={5}
                                placeholder="Наприклад: Savage Weekend Cup #1"
                                className="w-full bg-[#0f1418] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#7777f6] transition-colors"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
                                <AlignLeft size={14} className="text-[#7777f6]" /> Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows={5}
                                placeholder="Правила, формат, розклад, посилання на Discord..."
                                className="w-full bg-[#0f1418] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#7777f6] transition-colors resize-none leading-relaxed"
                            />
                        </div>
                    </div>

                    {/* 3. Логістика турніру */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/5">
                        <div>
                            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
                                <Calendar size={14} className="text-[#7777f6]" /> Start Date
                            </label>
                            <input
                                type="datetime-local"
                                name="start"
                                value={formData.start}
                                onChange={handleChange}
                                required
                                className="w-full bg-[#0f1418] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#7777f6] transition-colors [color-scheme:dark]"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
                                <Users size={14} className="text-[#7777f6]" /> Slots
                            </label>
                            <input
                                type="number"
                                name="maxTeamSize"
                                value={formData.maxTeamSize}
                                onChange={handleChange}
                                required
                                min={2}
                                max={256}
                                className="w-full bg-[#0f1418] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#7777f6] transition-colors"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
                                <Trophy size={14} className="text-[#7777f6]" /> Prize Pool
                            </label>
                            <input
                                type="text"
                                name="prizePoolSize"
                                value={formData.prizePoolSize}
                                onChange={handleChange}
                                required
                                placeholder="1000 UAH"
                                className="w-full bg-[#0f1418] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#7777f6] transition-colors"
                            />
                        </div>
                    </div>

                    {/* Кнопка створення */}
                    <div className="pt-8 mt-8 border-t border-white/5 flex justify-end">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            size="lg"
                            className="w-full md:w-auto px-12 shadow-[0_0_30px_rgba(119,119,246,0.2)]"
                        >
                            {isLoading ? "Uploading & Creating..." : "Launch Tournament"}
                        </Button>
                    </div>
                </form>
            </div>
        </main>
    );
}