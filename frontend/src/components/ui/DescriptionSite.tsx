import Image from "next/image";

interface DescriptionSiteProps {
    imageUrl: string;
    title: string;
    description: string;
}

const DescriptionSite = ({ imageUrl, title, description }: DescriptionSiteProps) => {
    return (
        <div className="group flex flex-col items-center text-center max-w-sm p-4">

            {/* --- Блок зображення з ефектом світіння --- */}
            <div className="relative mb-6 transition-transform duration-300 group-hover:scale-110">
                {/* Задній фон світіння (працює завдяки твоїм змінним кольорів) */}
                <div className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <Image
                    src={imageUrl}
                    alt={title}
                    width={140} // Зменшив розмір, бо 300px для іконки забагато
                    height={140}
                    className="relative z-10 drop-shadow-[0_0_10px_rgba(119,119,246,0.3)]"
                />
            </div>

            {/* --- Заголовок (використовуємо твій шрифт Orbitron) --- */}
            <h3 className="text-xl font-bold text-foreground mb-3 uppercase tracking-wider font-orbitron">
                {title}
            </h3>

            {/* --- Опис (сірий колір з твоїх змінних) --- */}
            <p className="text-muted-foreground text-sm leading-relaxed">
                {description}
            </p>
        </div>
    )
}

export default DescriptionSite;