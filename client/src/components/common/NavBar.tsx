import clsx from "clsx";
import Link from "../core/link/Link";

const NAVIGATION_ITEMS = [
    { label: "Home", path: "/" },
    { label: "Bookmarks", path: "/bookmarks" },
    { label: "About", path: "/about" },
    { label: "Search", path: "/search" },
];

const NavBar: React.FC<{ activeRoute: string; className?: string }> = ({
    activeRoute,
    className,
}) => {
    return (
        <nav className={clsx("flex justify-center gap-10", className)}>
            {NAVIGATION_ITEMS.map(({ label, path }) => (
                <Link
                    key={path}
                    className={clsx("italic", {
                        "font-bold": activeRoute === path,
                    })}
                    navigateTo={path}
                >
                    {label}
                </Link>
            ))}
        </nav>
    );
};

export default NavBar;
