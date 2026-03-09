import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authService } from "@/services/authService";

export function useVerify() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const router = useRouter();


    const [status, setStatus] = useState<"loading" | "success" | "error">(() => {
        return token ? "loading" : "error";
    });

    useEffect(() => {

        if (!token) return;


        authService.verifyEmail(token)
            .then(() => {
                setStatus("success");
                setTimeout(() => {
                    router.push("/login");
                }, 3000);
            })
            .catch((err) => {
                console.error("Verification error:", err);
                setStatus("error");
            });
    }, [token, router]);

    return { status };
}