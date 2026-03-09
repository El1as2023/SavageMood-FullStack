import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { teamService } from '@/services/teamService';
import { uploadService } from '@/services/uploadService'; // <--- Імпорт 1

export const useCreateTeam = () => {
    const router = useRouter();

    const [name, setName] = useState('');

    // Стани для файлу
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Обробка вибору файлу (Drag & Drop або клік)
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Ліміт 5MB
            if (file.size > 5 * 1024 * 1024) {
                setError("File size should be less than 5MB");
                return;
            }
            setSelectedFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
            setError(null);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
    };

    const createTeam = async (e: React.FormEvent) => {
        e.preventDefault();

        if (name.length < 3) {
            setError("Name must be at least 3 characters");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            let finalLogoUrl = undefined; // За замовчуванням пусто

            // 1. Якщо юзер вибрав файл -> вантажимо на Cloudinary
            if (selectedFile) {
                try {
                    // Це займе секунду-дві, поки картинка летить на сервер
                    finalLogoUrl = await uploadService.uploadImage(selectedFile);
                } catch (uploadErr) {
                    setError("Failed to upload image. Try again.");
                    setIsLoading(false);
                    return; // Зупиняємо процес, якщо картинка не завантажилась
                }
            }

            // 2. Тепер у нас є URL (або undefined), відправляємо на бекенд Go
            await teamService.create({
                name,
                logoUrl: finalLogoUrl // Go отримає готовий рядок "https://res.cloudinary..."
            });

            router.push('/profile');
            router.refresh();

        } catch (err: any) {
            const msg = err.response?.data?.error || "Failed to create team";
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        name, setName,
        selectedFile, previewUrl, handleFileSelect, handleRemoveFile,
        isLoading, error, createTeam
    };
};