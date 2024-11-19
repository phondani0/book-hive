import clsx from "clsx";

const NavBar: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <nav className={clsx("flex justify-center gap-10", className)}>
            <a href="/">Home</a>
            <a href="/bookmarks">Bookmarks</a>
            <a href="/about">About</a>
        </nav>
    );
};

export default NavBar;
