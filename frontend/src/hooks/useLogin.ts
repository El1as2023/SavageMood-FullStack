

import { useRouter } from "next/navigation";
import {useAuthStore} from "@/store/useAuthStore";
import {useState} from "react";
import {ILoginRequest} from "@/types";



export function useLogin() {
    const router = useRouter();

    const loginAction = useAuthStore((state) => state.login);
    const isLoading = useAuthStore((state) => state.isLoading);

    const [formData, setFormData] = useState<ILoginRequest>({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            await loginAction(formData);
            router.push("/profile");
        } catch (err: any) {
            if (err.response?.status === 403) {
                setError("Ваш аккаунт не активовано. Перевірте пошту");
            }else if (err.response?.status === 401) {
                setError("Неправильний пароль чи емейл");
            }else{
                setError("Щось пішло не так. Спробуйте пізніше")
            }
        }
    }

    return {
        formData,
        isLoading,
        error,
        handleChange,
        handleSubmit,
    }
}

