'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
    Calendar, Trophy, Users, Shield, ArrowLeft,
    CheckCircle2, AlertCircle, Crown, Layout, Info
} from 'lucide-react';

import { useTournament } from '@/hooks/useTournament';
import { useProfile } from '@/hooks/useProfile';
import { useRegisterTournament } from '@/hooks/useRegisterTournament';
import Button from '@/components/ui/Button';

const TournamentDetailsPage = () => {
    const params = useParams();
    const id = params.id as string;

    const [activeTab, setActiveTab] = useState<'info' | 'teams' | 'bracket'>('info');
    const [mounted, setMounted] = useState(false);

    const { tournament, isLoading, error, refetch } = useTournament(id);
    const { user } = useProfile();
    const { registerTeam, isRegistering, error: registerError } = useRegisterTournament(Number(id));

    // Вирішує проблему Hydration (image_6139e5.jpg)
    useEffect(() => {
        setMounted(true);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0f1418] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7777f6]"></div>
            </div>
        );
    }

    if (error || !tournament) {
        return (
            <div className="min-h-screen bg-[#0f1418] flex flex-col items-center justify-center text-white px-4">
                <h2 className="text-2xl font-bold mb-4 font-orbitron">Турнір не знайдено</h2>
                <Link href="/tournaments"><Button>Назад</Button></Link>
            </div>
        );
    }

    const isCaptain = user?.team?.captainId === user?.id;
    const isAlreadyRegistered = tournament.teams?.some(t => t.id === user?.team?.id);
    const isFull = (tournament.teams?.length || 0) >= tournament.max_teams;

    const formattedDate = mounted
        ? new Date(tournament.start_date).toLocaleDateString('uk-UA', {
            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
        })
        : "";

    return (
        <main className="min-h-screen bg-[#0f1418] pb-20">
            {/* HERO SECTION */}
            <div className="relative h-[40vh] w-full">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1418] via-[#0f1418]/40 to-transparent z-10"></div>
                <img
                    src={tournament.banner_url || '/images/default-tournament.jpg'}
                    alt={tournament.title}
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute bottom-0 left-0 w-full p-8 z-20 container mx-auto">
                    <div className="flex flex-col md:flex-row items-end justify-between gap-8">
                        <div>
                            <h1 className="text-4xl md:text-6xl font-bold text-white font-orbitron mb-4 uppercase tracking-tighter">
                                {tournament.title}
                            </h1>
                        </div>
                        <div className="min-w-[260px]">
                            {/* 1. Якщо гравець НЕ залогінений */}
                            {!user ? (
                                <Button href="/login" size="lg" className="w-full">
                                    Увійти для участі
                                </Button>

                                /* 2. Якщо вже зареєстрований */
                            ) : isAlreadyRegistered ? (
                                <div className="bg-green-500/20 border border-green-500/30 px-8 py-4 rounded-2xl flex items-center justify-center gap-3 text-green-400">
                                    <CheckCircle2 size={24} /> <span className="font-black uppercase tracking-widest">Зареєстровано</span>
                                </div>

                                /* 3. Якщо немає вільних місць */
                            ) : isFull ? (
                                <div className="bg-red-500/10 border border-red-500/20 px-8 py-4 rounded-2xl flex items-center justify-center text-red-500 font-bold uppercase tracking-widest">
                                    Турнір заповнений
                                </div>

                                /* 4. ЯКЩО НЕМАЄ КОМАНДИ (Ось твоє виправлення!) */
                            ) : !user.team ? (
                                <Button href="/profile" size="lg" className="w-full bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/20">
                                    Створити команду
                                </Button>

                                /* 5. Якщо є команда, але він не капітан */
                            ) : !isCaptain ? (
                                <div className="bg-yellow-500/10 border border-yellow-500/20 px-4 py-4 rounded-2xl text-center text-yellow-500 font-bold uppercase text-[10px] tracking-widest">
                                    Тільки капітан реєструє команду
                                </div>

                                /* 6. Якщо все ОК (капітан з командою) -> Даємо зареєструватись */
                            ) : (
                                <div className="space-y-2">
                                    <Button
                                        onClick={() => registerTeam(user.team!.id).then(() => refetch())}
                                        disabled={isRegistering}
                                        size="lg"
                                        className="w-full shadow-lg shadow-blue-500/10"
                                    >
                                        {isRegistering ? "Реєстрація..." : "Зареєструвати команду"}
                                    </Button>
                                    {/* Вивід помилки з бекенду (наприклад, якщо хтось встиг зайняти останнє місце) */}
                                    {registerError && (
                                        <p className="text-red-400 text-[10px] text-center uppercase font-bold tracking-widest">{registerError}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* TABS */}
            <div className="border-b border-white/5 bg-[#141f1f]/80 sticky top-[72px] z-30 backdrop-blur-xl">
                <div className="container mx-auto px-6 flex gap-8">
                    {['info', 'teams', 'bracket'].map((t) => (
                        <button
                            key={t}
                            onClick={() => setActiveTab(t as any)}
                            className={`py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${
                                activeTab === t ? 'text-[#7777f6] border-[#7777f6]' : 'text-gray-500 border-transparent hover:text-gray-300'
                            }`}
                        >
                            {t === 'info' ? 'Огляд' : t === 'teams' ? 'Учасники' : 'Сітка'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="container mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    {activeTab === 'info' && (
                        <div className="bg-[#141f1f] p-8 rounded-3xl border border-white/5 text-gray-400 leading-relaxed">
                            {tournament.description}
                        </div>
                    )}

                    {activeTab === 'teams' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {tournament.teams?.map((team) => (
                                <div key={team.id} className="bg-[#141f1f] p-5 rounded-2xl border border-white/5 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#0f1418] rounded-xl border border-white/10 overflow-hidden flex items-center justify-center">
                                        {team.logoUrl ? <img src={team.logoUrl} className="w-full h-full object-cover" /> : <Shield className="text-gray-700" />}
                                    </div>
                                    <span className="font-bold text-white uppercase tracking-tight">{team.name}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'bracket' && (
                        <div className="w-full min-h-[600px] bg-[#141f1f] rounded-3xl overflow-hidden border border-white/5 shadow-2xl relative">
                            {tournament.challongeUrl ? (
                                <iframe
                                    src={`https://challonge.com/uk/${tournament.challongeUrl}/module?theme=1`}
                                    width="100%"
                                    height="600"
                                    frameBorder="0" // маленькими
                                    scrolling="auto"
                                    allowTransparency={true}
                                    sandbox="allow-scripts allow-same-origin allow-forms"
                                    style={{
                                        filter: 'invert(0.9) hue-rotate(180deg) brightness(1.2)',
                                    }}
                                />
                            ) : (
                                <div
                                    className="flex items-center justify-center h-[600px] text-gray-600 font-bold uppercase text-xs">Bracket
                                    Pending</div>
                            )}
                        </div>
                    )}
                </div>

                {/* LOGISTICS CARD */}
                <div className="space-y-6">
                    <div className="bg-[#141f1f] rounded-3xl p-8 border border-white/5 sticky top-40">
                        <div className="space-y-8">
                            <div className="flex justify-between items-center text-xs">
                                <Trophy className="text-yellow-500" size={20} />
                                <span className="font-black text-white text-xl">{tournament.prize_pool}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <Calendar className="text-[#7777f6]" size={18} />
                                <span className="text-white font-bold text-[10px]">{formattedDate}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <Users className="text-purple-500" size={20} />
                                <span className="text-white font-black">{tournament.teams?.length || 0} / {tournament.max_teams}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default TournamentDetailsPage;