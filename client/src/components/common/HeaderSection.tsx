import clsx from "clsx";

const HeaderSection = ({ className }: { className?: string }) => {
    return (
        <section className={clsx(className)}>
            <h1 className="text-5xl font-bold">
                Welcome to <span className="text-primary">BookHive</span>
            </h1>
            <div className="my-5">
                <p>
                    Discover your next favorite book with our curated collection
                    of literary treasures. From bestselling novels to hidden
                    gems, BookHive helps you explore, track, and share your
                    reading journey with fellow book lovers.
                </p>
            </div>
        </section>
    );
};

export default HeaderSection;
