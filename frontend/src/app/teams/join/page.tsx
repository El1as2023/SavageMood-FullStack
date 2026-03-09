'use client'

import Link from 'next/link';
import { ArrowLeft, Users, Loader2, AlertCircle, Search } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useJoinTeam } from '@/hooks/useJoinTeam';

const JoinTeamPage = () => {

    const {
        teamId,
        setTeamId,
        isLoading,
        error,
        joinTeam
    } = useJoinTeam();

    return (
        <main className="min-h-screen bg-[#0f1418] flex items-center justify-center px-4 py-20 relative overflow-hidden">

            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                <Link href="/profile" className="inline-flex items-center text-gray-500 hover:text-white mb-6 transition-colors">
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Profile
                </Link>

                <div className="bg-[#141f1f] rounded-3xl p-8 border border-white/5 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="inline-flex p-4 rounded-2xl bg-blue-500/10 text-blue-400 mb-4 border border-blue-500/20">
                            <Users size={32} />
                        </div>
                        <h1 className="text-3xl font-bold text-white font-orbitron">JOIN SQUAD</h1>
                        <p className="text-gray-400 mt-2 text-sm">Enter the Team ID to join your teammates.</p>
                    </div>

                    <form onSubmit={joinTeam} className="space-y-6">

                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1">
                                Team ID
                            </label>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    required
                                    value={teamId}
                                    onChange={(e) => setTeamId(e.target.value)}
                                    placeholder="e.g. 15"
                                    className="w-full bg-[#0f1418] border border-white/10 rounded-xl pl-12 pr-5 py-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all font-mono text-lg"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-3 text-red-400 text-sm bg-red-500/10 p-4 rounded-xl border border-red-500/20 animate-pulse">
                                <AlertCircle size={18} className="shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={isLoading || !teamId}
                            className="w-full py-4 text-base font-bold tracking-widest uppercase shadow-lg bg-blue-600 hover:bg-blue-500"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="animate-spin" size={20} /> Joining...
                                </div>
                            ) : "Join Team"}
                        </Button>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default JoinTeamPage;