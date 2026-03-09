'use client';
import {Input} from "@/components/ui/Input";
import Link from "next/link";
import {ButtonAuth} from "@/components/ui/ButtonAuth";
import {useLogin} from "@/hooks/useLogin";

export default function LoginPage() {

    const { formData, isLoading, error, handleChange, handleSubmit } = useLogin();

    return (
        <div className="flex min-h-screen items-center justify-center bg-black p-4">
            <div className="w-full max-w-md">

                {/* Header / Logo */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                        Savage<span className="text-red-600">Mood</span>
                    </h1>
                    <p className="text-zinc-500 mt-2 font-medium">З поверненням, чемпіоне </p>
                </div>

                {/* Form Container */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-zinc-950 p-8 rounded-2xl border border-zinc-900 shadow-2xl shadow-red-900/10"
                >

                    {/* Блок помилки */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-950/20 border border-red-900/50 text-red-500 rounded-lg text-sm flex items-center justify-center font-medium">
                            ⚠️ {error}
                        </div>
                    )}

                    <div className="space-y-6">
                        <Input
                            label="Email Address"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="pro.player@example.com"
                            required
                        />

                        <div className="space-y-1">
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
                    </div>

                    <div className="mt-8">
                        <ButtonAuth type="submit" isLoading={isLoading} variant="primary">
                            Увійти в систему
                        </ButtonAuth>
                    </div>

                    {/* Footer Link */}
                    <div className="text-center mt-8 pt-6 border-t border-zinc-900">
                        <p className="text-zinc-500 text-sm">
                            Ще не маєте акаунту?{" "}
                            <Link href="/register" className="text-red-600 hover:text-red-500 font-bold transition-colors ml-1">
                                Створити акаунт
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}