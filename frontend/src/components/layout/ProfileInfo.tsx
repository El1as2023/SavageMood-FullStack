'use client'

import { IUser } from '@/types';
import { Mail, Hash, Copy, Check } from 'lucide-react';
import { useState } from "react";

interface ProfileInfoProps {
    user: IUser;
}

const ProfileInfo = ({ user }: ProfileInfoProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(user.id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full max-w-2xl mx-auto mt-8">
            <h3 className="text-white font-orbitron text-lg mb-4 px-2">Інформація Про Аккаунт</h3>

            <div className="bg-[#141f1f] rounded-2xl border border-white/5 overflow-hidden">

                {/* Email Row */}
                <div className="p-5 flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="p-2 rounded bg-white/5 text-gray-400">
                            <Mail size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-0.5">Пошта</p>
                            <p className="text-white font-medium">{user.email}</p>
                        </div>
                    </div>
                </div>

                {/* ID Row */}
                <div className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4 w-full">
                        <div className="p-2 rounded bg-white/5 text-gray-400">
                            <Hash size={20} />
                        </div>
                        <div className="flex-1 min-w-0"> {/* min-w-0 для правильного truncate */}
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-0.5">User ID</p>
                            <p className="text-white/70 font-mono text-sm truncate">{user.id}</p>
                        </div>
                    </div>

                    {/* Кнопка копіювання */}
                    <button
                        onClick={handleCopy}
                        className="ml-4 p-2 text-gray-500 hover:text-white transition-colors"
                        title="Copy ID"
                    >
                        {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ProfileInfo;