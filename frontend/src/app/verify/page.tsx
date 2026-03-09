"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useVerify } from "@/hooks/useVerify";
import { Loader2, CheckCircle2, XCircle } from "lucide-react"; // npm i lucide-react
import { ButtonAuth } from "@/components/ui/ButtonAuth";


function VerifyContent() {
    const { status } = useVerify();

    return (
        <div className="w-full max-w-md p-8 bg-zinc-950 rounded-2xl border border-zinc-900 shadow-2xl text-center relative overflow-hidden">


            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>


            {status === "loading" && (
                <div className="flex flex-col items-center gap-6 relative z-10">
                    <Loader2 className="h-16 w-16 text-red-600 animate-spin" />
                    <div>
                        <h2 className="text-xl font-bold text-white">Перевіряємо ключ...</h2>
                        <p className="text-zinc-500 text-sm mt-1">Це займе лише мить</p>
                    </div>
                </div>
            )}


            {status === "success" && (
                <div className="flex flex-col items-center gap-6 relative z-10">
                    <CheckCircle2 className="h-20 w-20 text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    <div>
                        <h2 className="text-2xl font-black text-white uppercase italic">Акаунт активовано!</h2>
                        <p className="text-zinc-400 mt-2">Тепер ви частина SavageMood.</p>
                    </div>
                    <Link href="/login" className="w-full">
                        <ButtonAuth>Увійти зараз</ButtonAuth>
                    </Link>
                </div>
            )}


            {status === "error" && (
                <div className="flex flex-col items-center gap-6 relative z-10">
                    <XCircle className="h-20 w-20 text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
                    <div>
                        <h2 className="text-2xl font-black text-white uppercase italic">Помилка</h2>
                        <p className="text-zinc-400 mt-2">
                            Посилання недійсне або термін дії вичерпано.
                        </p>
                    </div>
                    <Link href="/register" className="w-full">
                        <ButtonAuth variant="outline">Спробувати ще раз</ButtonAuth>
                    </Link>
                </div>
            )}

        </div>
    );
}

// Головний компонент сторінки
export default function VerifyPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-black p-4">
            {/* Suspense потрібен для useSearchParams */}
            <Suspense fallback={<div className="text-red-600 animate-pulse">Loading interface...</div>}>
                <VerifyContent />
            </Suspense>
        </div>
    );
}