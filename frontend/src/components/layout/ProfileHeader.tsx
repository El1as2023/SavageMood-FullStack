import React from 'react';
import { IUser } from '@/types';
import { Shield, User } from 'lucide-react';

interface ProfileHeaderProps {
    user: IUser;
}

const ProfileHeader = ({ user }: ProfileHeaderProps) => {
    // Беремо перші 2 літери нікнейму для аватара
    const initials = user.username.slice(0, 2).toUpperCase();

    return (
        <div className="w-full bg-[#141f1f] border-b border-white/5 pb-10 pt-20 relative overflow-hidden">
            {/* Фоновий декоративний елемент */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-purple-900/20 to-transparent"></div>

            <div className="container mx-auto px-6 flex flex-col items-center justify-center text-center relative z-10">

                {/* Аватар (Генерація) */}
                <div className="w-32 h-32 mb-6 rounded-full border-4 border-[#0f1418] bg-[#1a1f2e] flex items-center justify-center shadow-[0_0_30px_rgba(119,119,246,0.3)]">
                    <span className="text-4xl font-bold text-white font-orbitron tracking-widest">
                        {initials}
                    </span>
                </div>

                {/* Нікнейм */}
                <h1 className="text-4xl font-bold text-white font-orbitron tracking-wide mb-2">
                    {user.username}
                </h1>

                {/* Роль (Бейдж) */}
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold uppercase text-xs tracking-wider">
                    {user.role === 'admin' ? <Shield size={14} /> : <User size={14} />}
                    {user.role}
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;