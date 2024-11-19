import clsx from "clsx";
import React from "react";

type LinkProps = {
    navigateTo: string;
    children: React.ReactNode;
    className?: string;
    isExternal?: boolean;
};

const Link: React.FC<LinkProps> = ({ navigateTo, children, className, isExternal }) => {
    return (
        <a
            className={clsx("flex items-center", className)}
            href={navigateTo}
            target={isExternal ? "_blank" : "_self"}
            rel="noreferrer"
        >
            {children}
        </a>
    );
};

export default Link;
