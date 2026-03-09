import Link from 'next/link';
import { ITournament } from '@/types';
import { Calendar, Users, Trophy } from 'lucide-react';

interface TournamentCardProps {
    tournament: ITournament;
}

const TournamentCard = ({ tournament }: TournamentCardProps) => {
    // Форматування дати
    const formattedDate = new Date(tournament.start_date).toLocaleDateString('uk-UA', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Підрахунок слотів
    const teamsRegistered = tournament.teams ? tournament.teams.length : 0;

    // Колір статусу
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'live':
            case 'ongoing':
                return 'text-red-500 border-red-500/50 bg-red-500/10 animate-pulse';
            case 'upcoming':
                return 'text-green-400 border-green-400/50 bg-green-400/10';
            case 'finished':
                return 'text-gray-400 border-gray-500/50 bg-gray-500/10';
            default:
                return 'text-blue-400 border-blue-400/50 bg-blue-400/10';
        }
    };

    return (
        <Link
            href={`/tournaments/${tournament.id}`}
            className="group relative block bg-[#141f1f] rounded-2xl overflow-hidden border border-white/5 hover:border-[#7777f6]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(119,119,246,0.15)]"
        >
            {/* Картинка / Банер */}
            <div className="h-48 w-full relative overflow-hidden">
                {/* Градієнт поверх картинки для читабельності */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#141f1f] via-transparent to-transparent z-10" />

                {/* Сама картинка (використовуємо звичайний img для простоти, або next/image) */}
                <img
                    src={tournament.banner_url || '/images/default-tournament.jpg'}
                    alt={tournament.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Бейдж статусу */}
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md z-20 ${getStatusColor(tournament.status)}`}>
                    {tournament.status === 'live' ? '● LIVE' : tournament.status}
                </div>
            </div>

            {/* Контент картки */}
            <div className="p-5 relative z-20">
                <h3 className="text-xl font-bold text-white font-orbitron mb-4 truncate group-hover:text-[#7777f6] transition-colors">
                    {tournament.title}
                </h3>

                <div className="space-y-3">
                    {/* Призовий фонд */}
                    <div className="flex items-center gap-3 text-gray-300">
                        <Trophy size={18} className="text-yellow-500" />
                        <span className="font-bold text-yellow-500">{tournament.prize_pool}</span>
                    </div>

                    {/* Дата */}
                    <div className="flex items-center gap-3 text-gray-400 text-sm">
                        <Calendar size={18} />
                        <span>{formattedDate}</span>
                    </div>

                    {/* Слоти */}
                    <div className="flex items-center gap-3 text-gray-400 text-sm">
                        <Users size={18} />
                        <div className="flex-1 flex items-center justify-between">
                            <span>Teams</span>
                            <span className={`${teamsRegistered >= tournament.max_teams ? 'text-red-400' : 'text-white'}`}>
                                {teamsRegistered} / {tournament.max_teams}
                            </span>
                        </div>
                    </div>

                    {/* Прогрес бар заповнення */}
                    <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                        <div
                            className="h-full bg-[#7777f6]"
                            style={{ width: `${(teamsRegistered / tournament.max_teams) * 100}%` }}
                        />
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default TournamentCard;