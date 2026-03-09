import Logo from "@/components/ui/Logo";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="bg-[#0f1418]"> {/* Переконайся, що фон співпадає з сайтом */}
            {/* Контейнер з верхньою рискою (border-t) */}
            <div className="container mx-auto px-6 py-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between">

                {/* Логотип та назва */}
                <div className="sm:flex items-center gap-3 mb-4 md:mb-0">
                    <Logo />
                    <span className="text-white font-bold font-orbitron tracking-wider text-xl">
                        SavageMood
                    </span>
                </div>

                {/* Соціальні мережі з відступами */}
                <div className="flex items-center gap-8">
                    <Link
                        href="https://t.me/Smoodreal"
                        className="text-gray-400 hover:text-[#229ED9] transition-colors font-medium"
                    >
                        Telegram
                    </Link>
                    <Link
                        href="https://www.youtube.com/@smoodreal"
                        className="text-gray-400 hover:text-[#FF0000] transition-colors font-medium"
                    >
                        YouTube
                    </Link>
                    <Link
                        href="https://www.instagram.com/smoodreal?igsh=dHYzamV6M3h4enE4"
                        className="text-gray-400 hover:text-[#E1306C] transition-colors font-medium"
                    >
                        Instagram
                    </Link>
                </div>
            </div>
        </footer>
    )
}

export default Footer