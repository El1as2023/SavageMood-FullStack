import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { teamService } from '@/services/teamService';


export const useTeamActions = () => {
    const router = useRouter();
    const [isActionLoading, setIsActionLoading] = useState(false);

    // Логіка виходу з команди
    const handleLeaveTeam = async (teamId: number) => {
        if (!confirm("Are you sure you want to leave this team?")) return;

        setIsActionLoading(true);
        try {
            await teamService.leave(teamId);
            // toast.success("You left the team");
            router.push('/profile'); // Повертаємо в профіль
            router.refresh();
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.error || "Failed to leave team");
        } finally {
            setIsActionLoading(false);
        }
    };

    // Логіка видалення команди (Тільки для капітана)
    const handleDeleteTeam = async (teamId: number) => {
        const confirmed = confirm("WARNING: This will permanently delete the team and remove all members. Continue?");
        if (!confirmed) return;

        setIsActionLoading(true);
        try {
            await teamService.delete(teamId);
            // toast.success("Team deleted successfully");
            router.push('/profile');
            router.refresh();
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.error || "Failed to delete team");
        } finally {
            setIsActionLoading(false);
        }
    };

    return {
        handleLeaveTeam,
        handleDeleteTeam,
        isActionLoading
    };
};