'use client';
import {useRegister} from "@/hooks/useRegister";
import {Button} from "@/components/ui/Button";
import Link from "next/link";
import {Input} from "@/components/ui/Input";

export default function  RegisterPage(){
    const {formData, status, errorMessage, handleChange, register} = useRegister()

    if (status === "success") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black p-4">
                <div className="w-full max-w-md bg-zinc-950 p-8 rounded-2xl border border-zinc-900 text-center shadow-2xl shadow-red-900/10">
                    <div className="mx-auto w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mb-4">
                        <span className="text-3xl">✉️</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Підтвердіть пошту</h2>
                    <p className="text-zinc-400 mb-6">
                        Ми відправили магічне посилання на <span className="text-red-400">{formData.email}</span>.
                    </p>
                    <Link href="/login">
                        <Button variant="outline">Перейти до входу</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-black p-4">
            <div className="w-full max-w-md">
                {/* Логотип або Заголовок */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                        Savage<span className="text-red-600">Mood</span>
                    </h1>
                    <p className="text-zinc-500 mt-2">Приєднуйся до битви</p>
                </div>

                <form
                    onSubmit={register}
                    className="bg-zinc-950 p-8 rounded-2xl border border-zinc-900 shadow-xl"
                >
                    {errorMessage && (
                        <div className="mb-6 p-3 bg-red-950/30 border border-red-900/50 text-red-400 rounded-lg text-sm text-center">
                            {errorMessage}
                        </div>
                    )}

                    <div className="space-y-5">
                        <Input
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="SavagePlayer1"
                            required
                        />

                        <Input
                            label="Email"
                            name= "email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                        />

                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="mt-8">
                        <Button type="submit" isLoading={status === "loading"}>
                            Створити акаунт
                        </Button>
                    </div>

                    <p className="text-center text-zinc-500 text-sm mt-6">
                        Вже є акаунт?{" "}
                        <Link href="/login" className="text-red-500 hover:text-red-400 font-medium transition-colors">
                            Увійти
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}