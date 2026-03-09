import Link from 'next/link';
import {Shield, Trophy, Plus, ArrowRight, Users} from 'lucide-react';
import {IUser} from "@/types";

interface ProfileTeamProps {
    user: IUser;
}

const ProfileTeam = ({ user }: ProfileTeamProps) => {
    // 1. ВАРІАНТ: У юзера Є команда
    if (user.team) {
        const isCaptain = user.id === user.team.captainId;

        return (
            <div className="w-full max-w-2xl mx-auto mt-8">
                <h2 className="text-xl font-bold text-white font-orbitron mb-4 px-2 border-l-4 border-[#7777f6]">
                    MY SQUAD
                </h2>

                <div className="bg-[#141f1f] rounded-2xl p-6 border border-white/5 relative overflow-hidden group hover:border-[#7777f6]/50 transition-all duration-300">
                    {/* Фоновий ефект */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#7777f6]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                    <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
                        {/* Лого команди */}
                        <div className="w-20 h-20 rounded-2xl bg-[#0f1418] border border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
                            {user.team.logoUrl ? (
                                <img src={user.team.logoUrl} alt={user.team.name} className="w-full h-full object-cover" />
                            ) : (
                                <Shield size={32} className="text-[#7777f6]" />
                            )}
                        </div>

                        {/* Інфо */}
                        <div className="flex-1 text-center sm:text-left space-y-1">
                            <h3 className="text-2xl font-bold text-white tracking-wide">{user.team.name}</h3>
                            <div className="flex items-center justify-center sm:justify-start gap-2 text-sm">
                                <span className="text-gray-400">Role:</span>
                                <span className={`font-bold uppercase tracking-wider px-2 py-0.5 rounded text-xs ${isCaptain ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                                    {isCaptain ? 'Captain' : 'Member'}
                                </span>
                            </div>
                        </div>

                        {/* Кнопка переходу */}
                        <Link
                            href={`/teams/${user.team.id}`}
                            className="group/btn flex items-center gap-2 bg-[#0f1418] hover:bg-[#7777f6] text-white px-5 py-3 rounded-xl border border-white/10 transition-all duration-300"
                        >
                            <span className="font-bold text-sm">SQUAD</span>
                            <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // 2. ВАРІАНТ: У юзера НЕМАЄ команди
    return (
        <div className="w-full max-w-2xl mx-auto mt-8">
            <h2 className="text-xl font-bold text-white font-orbitron mb-4 px-2 border-l-4 border-gray-600">
                МІЙ СКЛАД
            </h2>

            <div className="bg-[#141f1f] rounded-2xl p-8 border border-dashed border-white/10 text-center hover:border-[#7777f6]/30 transition-colors group">
                <div className="w-14 h-14 bg-[#0f1418] rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500 group-hover:text-[#7777f6] transition-colors border border-white/5">
                    <Trophy size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Ще немає команди</h3>
                <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
                    Приєднуйтесь до існуючої команди, щоб брати участь у турнірах або створити власну спадщину.
                </p>

                {/* ОНОВЛЕНИЙ БЛОК КНОПОК */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/teams/create"
                        className="inline-flex justify-center items-center gap-2 bg-[#7777f6] hover:bg-[#6666e0] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(119,119,246,0.3)] hover:shadow-[0_0_30px_rgba(119,119,246,0.5)] hover:-translate-y-0.5"
                    >
                        <Plus size={18} />
                        Створити Команду
                    </Link>

                    <Link
                        href="/teams/join"
                        className="inline-flex justify-center items-center gap-2 bg-[#0f1418] hover:bg-white/5 text-white border border-white/20 hover:border-white/40 px-6 py-3 rounded-xl font-bold transition-all hover:-translate-y-0.5"
                    >
                        <Users size={18} />
                        Приєднатись до команди
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default ProfileTeam;