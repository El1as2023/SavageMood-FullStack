import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import DescriptionSite from "@/components/ui/DescriptionSite";

const Hero = () => {
    return (
        <section className="bg-muted rounded-l-lg">
            <div className="container mx-auto text-center justify-center pt-32 pb-20 ">
                <div className="flex justify-center mb-8">
                    <Logo />
                </div>

                <div className="mb-8">
                    <h2 className="mb-10 text-5xl font-bold ">
                        Увімкни режим Savage!
                    </h2>
                    <p className="max-w-xl mx-auto pb-10">
                        Прокачуй свій скіл, знищуй суперників, забирай реальні призи та стань частиною елітної спільноти безжальних геймерів. Домінуй без компромісів.
                    </p>
                    <Button className="block mx-auto" href="/register">РОЗПОЧАТИ ПОЛЮВАННЯ</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start justify-items-center mx-auto max-w-6xl px-4">
                    <DescriptionSite
                        imageUrl="/banner1.png" //
                        title="Домінуй"
                        description="Змагайся на межі своїх можливостей у найкращих іграх. Вривайся в рейтингові матчі, піднімайся на вершини лідербордів і доводь свою перевагу над іншими гравцями."
                    />
                    <DescriptionSite
                        imageUrl="/banner2.png"
                        title="Стеж"
                        description="Відчуй екшн наживо. Слідкуй за топовими протистояннями, навчайся тактиці у найнебезпечніших хижаків сцени та завжди будь у центрі кіберспортивних подій."
                    />
                    <DescriptionSite
                        imageUrl="/banner3.png"
                        title="Забирай своє"
                        description="Отримуй нагороди за свій жорсткий гринд. Виконуй місії, підвищуй ранги та отримуй цінні призи за свою безжальну ефективність у грі."
                    />
                </div>
            </div>
        </section>
    )
}

export default Hero;