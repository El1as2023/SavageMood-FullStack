interface ButtonAuthProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    children: React.ReactNode;
    variant?: 'primary' | 'outline'; // Додав варіанти для гнучкості
}

export function ButtonAuth({ isLoading, children, variant = 'primary', ...props }: ButtonAuthProps) {
    const baseStyles = "w-full py-3 rounded-lg font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center";

    const variants = {
        primary: "bg-red-600 hover:bg-red-700 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_20px_rgba(220,38,38,0.5)]",
        outline: "bg-transparent border border-zinc-700 text-zinc-300 hover:border-red-600 hover:text-red-500"
    };

    return (
        <button
            {...props}
            disabled={isLoading || props.disabled}
            className={`${baseStyles} ${variants[variant]}`}
        >
            {isLoading ? (
                <span className="flex items-center gap-2">
          {/* Червоний спінер */}
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Зачекайте...
        </span>
            ) : children}
        </button>
    );
}