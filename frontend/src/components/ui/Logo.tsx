import Link from "next/link";
import Image from 'next/image';

const Logo = () => {
    return (
        <Link href="/">
            <Image
                src="/logo.png" // Шлях від папки public
                alt="Логотип компанії"
                width={100}            // Бажана ширина
                height={50}            // Бажана висота
                priority               // Додайте це, якщо логотип у шапці (LCP)
            />
        </Link>
    )
}

export default Logo;