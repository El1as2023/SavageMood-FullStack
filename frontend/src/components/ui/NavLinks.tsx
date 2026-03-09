import Link from "next/link";

const NavLinks = () => {
    return (
        <nav className="flex gap-1 p-1 border rounded-full glass">
            <Link className="px-4 py-2 text-sm text-nav rounded-full hover:text-foreground hover:bg-surface" href="/tournaments">Змагання</Link>
            <Link className="px-4 py-2 text-sm text-nav rounded-full hover:text-foreground hover:bg-surface" href="/profile">Профіль</Link>
        </nav>
    )
}
export default NavLinks;