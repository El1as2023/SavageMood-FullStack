
export const uploadService = {
    uploadImage: async (file: File): Promise<string> => {
        // 1. Отримуємо змінні всередині функції (це гарантує, що вони вже завантажені)
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

        // 2. Робимо перевірку, щоб уникнути помилок, якщо .env не підтягнувся
        if (!cloudName || !uploadPreset) {
            console.error("Cloudinary config missing. Check .env.local");
            throw new Error("Configuration error: Missing Cloudinary credentials");
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Cloudinary error details:", errorData);
                throw new Error(errorData.error?.message || 'Failed to upload image');
            }

            const data = await response.json();
            // secure_url - це HTTPS посилання на картинку
            return data.secure_url;
        } catch (error) {
            console.error("Cloudinary upload error:", error);
            throw error;
        }
    }
};