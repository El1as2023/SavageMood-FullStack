'use client'

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Shield, Calendar, Users, Copy, Crown, Trash2, LogOut } from 'lucide-react';

// Хуки
import { useTeam } from '@/hooks/useTeam';
import { useProfile } from '@/hooks/useProfile'; // <--- 1. Додали useProfile
import { useTeamActions } from '@/hooks/useTeamActions'; // <--- 2. Додали actions

import Button from '@/components/ui/Button';

const TeamDetailsPage = () => {
    const params = useParams();
    const teamId = Number(params.id); // Конвертуємо в число для бекенду

    // Завантажуємо дані
    const { team, isLoading: isTeamLoading, error } = useTeam(String(teamId));
    const { user: currentUser } = useProfile(); // Отримуємо поточного юзера
    const { handleLeaveTeam, handleDeleteTeam, isActionLoading } = useTeamActions();

    if (isTeamLoading) {
        return (
            <div className="min-h-screen bg-[#0f1418] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7777f6]"></div>
            </div>
        );
    }

    if (error || !team) {
        return (
            <div className="min-h-screen bg-[#0f1418] flex flex-col items-center justify-center text-white">
                <h1 className="text-2xl font-bold mb-4">Team Not Found</h1>
                <Link href="/profile" className="text-[#7777f6] hover:underline">Back to Profile</Link>
            </div>
        );
    }

    // Перевіряємо роль поточного користувача
    const isCaptain = currentUser?.id === team.captainId;
    const isMember = team.members?.some(m => m.userId === currentUser?.id);

    return (
        <main className="min-h-screen bg-[#0f1418] pb-20">

            {/* --- HERO SECTION --- */}
            <div className="relative h-64 md:h-80 w-full overflow-hidden">
                <div className="absolute inset-0 bg-[#7777f6]/5"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#7777f6]/20 rounded-full blur-[100px]"></div>

                <div className="container mx-auto px-6 h-full flex flex-col justify-center relative z-10">
                    <Link href="/profile" className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors w-fit">
                        <ArrowLeft size={20} className="mr-2" />
                        Back
                    </Link>

                    <div className="flex items-center gap-6 md:gap-8">
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-[#141f1f] rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl shrink-0">
                            {team.logoUrl ? (
                                <img src={team.logoUrl} alt={team.name} className="w-full h-full object-cover" />
                            ) : (
                                <Shield size={48} className="text-[#7777f6]" />
                            )}
                        </div>

                        <div>
                            <h1 className="text-3xl md:text-5xl font-bold text-white font-orbitron mb-2 uppercase tracking-tight">
                                {team.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm">
                                <span className="flex items-center gap-1.5">
                                    <Calendar size={14} />
                                    Founded: {new Date(team.createdAt).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Users size={14} />
                                    Members: {team.members?.length || 0}/5
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- CONTENT --- */}
            <div className="container mx-auto px-6 mt-8 md:mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN: Roster */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white font-orbitron border-l-4 border-[#7777f6] pl-3">
                                ACTIVE ROSTER
                            </h2>
                            {/* Показуємо кнопку Invite тільки якщо є місця */}
                            {(team.members?.length || 0) < 5 && isCaptain && (
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(String(team.id));
                                        alert("Team ID copied to clipboard!");
                                    }}
                                    className="text-xs font-bold text-[#7777f6] hover:text-white uppercase tracking-wider flex items-center gap-2 transition-colors"
                                >
                                    <Copy size={14} />
                                    Copy Invite ID
                                </button>
                            )}
                        </div>

                        <div className="grid gap-4">
                            {team.members && team.members.length > 0 ? (
                                team.members.map((member) => (
                                    <div key={member.id} className="bg-[#141f1f] p-4 rounded-xl border border-white/5 flex items-center justify-between group hover:border-[#7777f6]/30 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-[#0f1418] flex items-center justify-center text-gray-500 border border-white/5">
                                                <Users size={18} />
                                            </div>
                                            <div>
                                                {/* Тут ми перевіряємо, чи є об'єкт user, бо в інтерфейсі ITeamMember він опціональний */}
                                                <p className="text-white font-bold">{member.user?.username || "Player"}</p>
                                                <p className="text-xs text-gray-500">Joined {new Date(member.joinedAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {member.role === 'captain' && (
                                                <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 text-[10px] font-bold uppercase rounded border border-yellow-500/20 flex items-center gap-1">
                                                    <Crown size={10} /> Captain
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-500 text-center py-8">No members found.</div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Actions */}
                    <div className="space-y-6">
                        {/* Показуємо цей блок тільки якщо юзер є частиною команди */}
                        {(isCaptain || isMember) && (
                            <div className="bg-[#141f1f] p-6 rounded-2xl border border-white/5">
                                <h3 className="text-white font-bold mb-4">Team Actions</h3>
                                <div className="space-y-3">

                                    {/* Кнопка 1: Видалити (Тільки Капітан) */}
                                    {isCaptain && (
                                        <button
                                            onClick={() => handleDeleteTeam(teamId)}
                                            disabled={isActionLoading}
                                            className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 p-3 rounded-xl font-bold transition-all disabled:opacity-50"
                                        >
                                            {isActionLoading ? 'Processing...' : (
                                                <>
                                                    <Trash2 size={16} /> Delete Team
                                                </>
                                            )}
                                        </button>
                                    )}

                                    {/* Кнопка 2: Вийти (Тільки Учасник, не Капітан) */}
                                    {isMember && !isCaptain && (
                                        <button
                                            onClick={() => handleLeaveTeam(teamId)}
                                            disabled={isActionLoading}
                                            className="w-full flex items-center justify-center gap-2 bg-[#0f1418] hover:bg-red-500/10 text-gray-400 hover:text-red-400 border border-white/10 p-3 rounded-xl font-bold transition-all disabled:opacity-50"
                                        >
                                            {isActionLoading ? 'Processing...' : (
                                                <>
                                                    <LogOut size={16} /> Leave Team
                                                </>
                                            )}
                                        </button>
                                    )}

                                </div>
                            </div>
                        )}

                        <div className="bg-[#141f1f] p-6 rounded-2xl border border-white/5 opacity-50">
                            <h3 className="text-white font-bold mb-2">Tournament Stats</h3>
                            <p className="text-sm text-gray-500">No active tournaments.</p>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
};

export default TeamDetailsPage;