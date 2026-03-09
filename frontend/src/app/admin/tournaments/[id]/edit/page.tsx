'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Trophy, AlignLeft, Calendar, Users, Image as ImageIcon,
    Type, ArrowLeft, AlertCircle, UploadCloud, Loader2, Save
} from 'lucide-react';

import { useTournament } from '@/hooks/useTournament'; // Для отримання поточних даних
import { useEditTournament } from '@/hooks/useEditTournament'; // Твій новий хук для оновлення
import Button from '@/components/ui/Button';

export default function EditTournamentPage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();

    // 1. Отримуємо поточні дані турніру
    const { tournament, isLoading: isFetching, error: fetchError } = useTournament(id);

    // 2. Підключаємо хук для оновлення
    const { updateTournament, isUpdating, error: updateError } = useEditTournament(Number(id));

    // Стан для картинки
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

    // 3. Коли дані турніру завантажились, підставляємо їх у форму
    useEffect(() => {
        if (tournament) {
            // Форматуємо дату з БД (ISO) у формат для <input type="datetime-local"> (YYYY-MM-DDThh:mm)
            const startDate = new Date(tournament.start_date);
            const formattedDate = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 16);

            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFormData({
                title: tournament.title,
                description: tournament.description,
                start: formattedDate,
                maxTeamSize: tournament.max_teams,
                prizePoolSize: tournament.prize_pool
            });

            // Встановлюємо поточний банер як прев'ю
            setPreview(tournament.banner_url);
        }
    }, [tournament]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];

            if (selectedFile.size > 5 * 1024 * 1024) {
                alert("Файл занадто великий! Максимум 5MB.");
                return;
            }

            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'maxTeamSize' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Передаємо оновлені дані. Файл передаємо тільки якщо адмін вибрав новий
            await updateTournament(formData, file);
        } catch (err) {
            console.error("Помилка оновлення:", err);
        }
    };

    // Стан завантаження (поки тягнемо дані з бекенду)
    if (isFetching) {
        return (
            <div className="min-h-screen bg-[#0f1418] flex items-center justify-center">
                <Loader2 className="animate-spin text-[#7777f6]" size={48} />
            </div>
        );
    }

    if (fetchError || !tournament) {
        return (
            <div className="min-h-screen bg-[#0f1418] flex flex-col items-center justify-center text-white px-4">
                <AlertCircle className="text-red-500 mb-4" size={48} />
                <h2 className="text-2xl font-bold mb-4 font-orbitron">Турнір не знайдено</h2>
                <Button onClick={() => router.push('/admin')}>Повернутися в адмінку</Button>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#0f1418] text-white py-12 px-6">
            <div className="max-w-3xl mx-auto">
                <Link href="/admin" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 text-xs font-bold uppercase tracking-widest">
                    <ArrowLeft size={16} /> Повернутися в панель керування
                </Link>

                <div className="mb-10">
                    <h1 className="text-4xl font-bold font-orbitron uppercase tracking-tighter mb-2 text-[#7777f6]">
                        Edit Tournament
                    </h1>
                    <p className="text-gray-400">Внесіть зміни у налаштування турніру.</p>
                </div>

                {updateError && (
                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-400 mb-8 animate-in fade-in">
                        <AlertCircle size={20} />
                        <span className="font-bold text-sm">{updateError}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8 bg-[#141f1f] p-8 rounded-3xl border border-white/5 shadow-2xl">

                    {/* Банер */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400">
                            <ImageIcon size={14} className="text-[#7777f6]" /> Банер турніру
                        </label>

                        <div className={`relative group h-64 w-full bg-[#0f1418] rounded-2xl border-2 border-dashed transition-all overflow-hidden ${preview ? 'border-transparent' : 'border-white/10 hover:border-[#7777f6]/50'}`}>
                            {preview ? (
                                <>
                                    <img src={preview} className="w-full h-full object-cover opacity-80 group-hover:opacity-40 transition-opacity" alt="Preview" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        <span className="bg-black/80 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                            <UploadCloud size={16} /> Змінити зображення
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500 group-hover:text-[#7777f6] transition-colors">
                                    <UploadCloud size={40} className="mb-3" />
                                    <p className="text-xs font-bold uppercase tracking-widest">Завантажити новий банер</p>
                                </div>
                            )}
                            {/* Зверни увагу: required тут прибрано, бо старий банер вже є */}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            />
                        </div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                            Залиште поле порожнім, щоб зберегти поточне зображення.
                        </p>
                    </div>

                    {/* Текстові поля */}
                    <div className="space-y-6 pt-6 border-t border-white/5">
                        <div>
                            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
                                <Type size={14} className="text-[#7777f6]" /> Назва турніру
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                minLength={5}
                                className="w-full bg-[#0f1418] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#7777f6] transition-colors"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
                                <AlignLeft size={14} className="text-[#7777f6]" /> Опис та правила
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows={5}
                                className="w-full bg-[#0f1418] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#7777f6] transition-colors resize-none leading-relaxed"
                            />
                        </div>
                    </div>

                    {/* Числові поля та Дата */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/5">
                        <div>
                            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
                                <Calendar size={14} className="text-[#7777f6]" /> Дата початку
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
                                <Users size={14} className="text-[#7777f6]" /> Макс. команд
                            </label>
                            <input
                                type="number"
                                name="maxTeamSize"
                                value={formData.maxTeamSize}
                                onChange={handleChange}
                                required
                                min={2}
                                className="w-full bg-[#0f1418] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#7777f6] transition-colors"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
                                <Trophy size={14} className="text-[#7777f6]" /> Призовий фонд
                            </label>
                            <input
                                type="text"
                                name="prizePoolSize"
                                value={formData.prizePoolSize}
                                onChange={handleChange}
                                required
                                className="w-full bg-[#0f1418] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#7777f6] transition-colors"
                            />
                        </div>
                    </div>

                    {/* Кнопка */}
                    <div className="pt-8 mt-8 border-t border-white/5 flex justify-end">
                        <Button
                            type="submit"
                            disabled={isUpdating}
                            size="lg"
                            className="w-full md:w-auto px-12 shadow-[0_0_30px_rgba(119,119,246,0.2)] flex items-center gap-2"
                        >
                            {isUpdating ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            {isUpdating ? "Оновлення..." : "Зберегти зміни"}
                        </Button>
                    </div>
                </form>
            </div>
        </main>
    );
}