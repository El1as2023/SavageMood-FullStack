'use client'

import Link from 'next/link';
import {
    Plus, Play, CheckSquare, Trash2, Settings,
    Calendar, Users, AlertCircle, Loader2, Pencil
} from 'lucide-react';

import { useAdminTournaments } from '@/hooks/useAdminTournaments';
import Button from '@/components/ui/Button';

export default function AdminDashboardPage() {
    const {
        tournaments, isLoading, actionLoading, error,
        handleStart, handleFinish, handleDelete
    } = useAdminTournaments();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0f1418] flex items-center justify-center">
                <Loader2 className="animate-spin text-[#7777f6]" size={48} />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#0f1418] text-white py-12 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold font-orbitron uppercase tracking-tighter mb-2 flex items-center gap-3">
                            <Settings className="text-[#7777f6]" size={36} /> Control Center
                        </h1>
                        <p className="text-gray-400">Керування всіма турнірами платформи</p>
                    </div>
                    <Link href="/admin/tournaments/create">
                        <Button className="flex items-center gap-2 shadow-[0_0_20px_rgba(119,119,246,0.2)]">
                            <Plus size={18} /> Створити турнір
                        </Button>
                    </Link>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-400 mb-8">
                        <AlertCircle size={20} /> <span className="font-bold">{error}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4">
                    {tournaments.length === 0 ? (
                        <div className="bg-[#141f1f] border border-white/5 rounded-3xl p-12 text-center text-gray-500">
                            Турнірів ще немає. Створіть свій перший івент!
                        </div>
                    ) : (
                        tournaments.map((tournament) => (
                            <div key={tournament.id} className="bg-[#141f1f] border border-white/5 rounded-2xl p-6 flex flex-col lg:flex-row items-center justify-between gap-6 hover:border-white/10 transition-all">

                                <div className="flex items-center gap-6 w-full lg:w-auto">
                                    <div className="w-24 h-16 bg-black rounded-lg overflow-hidden shrink-0 border border-white/10">
                                        <img src={tournament.banner_url || '/images/default-tournament.jpg'} alt="" className="w-full h-full object-cover opacity-70" />
                                    </div>
                                    <div>
                                        <Link href={`/tournaments/${tournament.id}`} className="text-xl font-bold uppercase tracking-tight hover:text-[#7777f6] transition-colors">
                                            {tournament.title}
                                        </Link>
                                        <div className="flex flex-wrap items-center gap-4 mt-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                            <span className={`px-2 py-1 rounded text-[10px] ${
                                                tournament.status === 'live' ? 'bg-green-500/20 text-green-400' :
                                                    tournament.status === 'finished' ? 'bg-gray-500/20 text-gray-400' :
                                                        'bg-[#7777f6]/20 text-[#7777f6]'
                                            }`}>
                                                {tournament.status}
                                            </span>
                                            <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(tournament.start_date).toLocaleDateString('uk-UA')}</span>
                                            <span className="flex items-center gap-1"><Users size={12}/> {tournament.teams?.length || 0}/{tournament.max_teams}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Кнопки керування */}
                                <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
                                    {tournament.status === 'upcoming' && (
                                        <button onClick={() => handleStart(tournament.id)} disabled={actionLoading === tournament.id} className="bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500 hover:text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2">
                                            {actionLoading === tournament.id ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />} Start
                                        </button>
                                    )}

                                    {tournament.status === 'live' && (
                                        <button onClick={() => handleFinish(tournament.id)} disabled={actionLoading === tournament.id} className="bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500 hover:text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2">
                                            {actionLoading === tournament.id ? <Loader2 size={14} className="animate-spin" /> : <CheckSquare size={14} />} Finish
                                        </button>
                                    )}

                                    {/* КНОПКА EDIT */}
                                    <Link href={`/admin/tournaments/${tournament.id}/edit`}>
                                        <button
                                            disabled={actionLoading === tournament.id}
                                            className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 hover:bg-yellow-500 hover:text-white p-2 rounded-xl transition-all disabled:opacity-50"
                                            title="Редагувати турнір"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                    </Link>

                                    {/* КНОПКА DELETE */}
                                    <button onClick={() => handleDelete(tournament.id)} disabled={actionLoading === tournament.id} className="bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white p-2 rounded-xl transition-all disabled:opacity-50" title="Видалити турнір">
                                        {actionLoading === tournament.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}