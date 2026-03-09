'use client'

import { useCreateTeam } from '@/hooks/useCreateTeam';
import CreateTeamForm from "@/components/layout/CreateTeamForm"; // Перевір шлях, якщо компонент лежить в іншому місці

const CreateTeamPage = () => {
    // 1. Викликаємо оновлений хук
    const {
        name, setName,
        selectedFile, previewUrl, handleFileSelect, handleRemoveFile, // <--- Додали ці поля
        isLoading, error, createTeam
    } = useCreateTeam();

    return (
        <main className="min-h-screen bg-[#0f1418] flex items-center justify-center px-4 py-20 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
            </div>

            {/* 2. Рендеримо компонент з новими пропсами */}
            <CreateTeamForm
                name={name}
                setName={setName}

                // Передаємо нові пропси для файлів
                selectedFile={selectedFile}
                previewUrl={previewUrl}
                handleFileSelect={handleFileSelect}
                handleRemoveFile={handleRemoveFile}

                isLoading={isLoading}
                error={error}
                onSubmit={createTeam}
            />
        </main>
    );
};

export default CreateTeamPage;