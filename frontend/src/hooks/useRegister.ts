
import {useState} from "react";
import {IRegisterRequest} from "@/types";
import {authService} from "@/services/authService";

export function useRegister() {
    const [formData, setFormData] = useState<IRegisterRequest>({
        username: "",
        email: "",
        password: "",
    });

    const [status,setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage,setErrorMessage] = useState("");

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const register = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMessage("");

        try{
            await authService.register(formData);
            setStatus("success");
        }catch(err:any){
            setStatus("error");
            setErrorMessage(err.response?.data?.error || "Помилка реєстрації");
        }finally {
            if (status == "success") setStatus("idle");
        }
    };
    return {
        formData,
        status,
        errorMessage,
        handleChange,
        register,
    }

}