'use client'

import { useProfile } from '@/hooks/useProfile';
import ProfileHeader from "@/components/layout/ProfileHeader";
import ProfileInfo from "@/components/layout/ProfileInfo";
import ProfileTeam from "@/components/layout/ProfileTeam";



const ProfilePage = () => {
    const { user, isLoading, handleLogout } = useProfile();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0f1418]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
        );
    }


    if (!user) return null;

    return (
        <main className="min-h-screen bg-[#0f1418]">

            {/* 1. Header (Banner + Avatar + Username) */}
            <ProfileHeader user={user} />

            <div className="container mx-auto px-6 pb-20">

                {/* 2. Info (Email + ID) */}
                <ProfileInfo user={user} />

                <ProfileTeam user={user} />

                {/* 3. Logout Button */}
                <div className="w-full max-w-2xl mx-auto mt-8 flex justify-center">
                    <button
                        onClick={handleLogout}
                        className="text-red-500 hover:text-red-400 font-bold text-sm uppercase tracking-widest transition-colors py-4"
                    >
                        Log Out
                    </button>
                </div>

            </div>
        </main>
    );
};

export default ProfilePage;