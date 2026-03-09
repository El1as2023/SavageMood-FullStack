import React from 'react';
import Link from 'next/link'; // <--- Додали імпорт Link

type ButtonSize = 'sm' | 'default' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    size?: ButtonSize;
    children: React.ReactNode;
    href?: string; // <--- Додали необов'язковий проп href
}

const Button = ({
                    className = '',
                    size = 'default',
                    children,
                    href, // <--- Дістаємо href
                    ...props
                }: ButtonProps) => {

    const baseClasses = "inline-flex items-center justify-center gap-2 rounded-full font-bold text-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 bg-gradient-to-r from-[#1E40AF] via-[#3B82F6] to-[#7C3AED] hover:opacity-90 shadow-lg hover:shadow-xl active:scale-95";


    const sizeClasses: Record<ButtonSize, string> = {
        sm: "px-4 py-2 text-sm",
        default: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
    };

    const classes = `${sizeClasses[size]} ${baseClasses} ${className}`;

    // 1. ЯКЩО Є ПОСИЛАННЯ (href) — рендеримо Link
    if (href) {
        return (
            <Link href={href} className={classes}>
                {children}
            </Link>
        );
    }

    // 2. ЯКЩО НЕМАЄ — рендеримо звичайну кнопку
    return (
        <button className={classes} {...props}>
            {children}
        </button>
    );
};

export default Button;