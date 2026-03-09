'use client'

import { useTournaments } from '@/hooks/useTournaments'; // <--- Імпортуємо наш новий хук
import TournamentCard from '@/components/ui/TournamentCard'; // Не забудь створити картку (код був вище)


const TournamentsPage = () => {
    // Використовуємо хук - все в одному рядку!
    const { tournaments, isLoading, error } = useTournaments();

    return (
        <main className="min-h-screen bg-[#0f1418] pt-28 pb-20 px-6">
            <div className="container mx-auto">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white font-orbitron mb-2">
                            ACTIVE <span className="text-[#7777f6]">TOURNAMENTS</span>
                        </h1>
                        <p className="text-gray-400">Join the battle and claim your glory.</p>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7777f6]"></div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="text-center text-red-500 py-10 bg-red-500/5 rounded-xl border border-red-500/20">
                        {error}
                    </div>
                )}

                {/* Data State (List) */}
                {!isLoading && !error && tournaments.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tournaments.map((tournament) => (
                            <TournamentCard key={tournament.id} tournament={tournament} />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !error && tournaments.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-xl font-orbitron">No active tournaments found.</p>
                        <p className="text-sm mt-2">Check back later for upcoming events.</p>
                    </div>
                )}

            </div>
        </main>
    );
};

export default TournamentsPage;