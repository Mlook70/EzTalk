"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SetStateAction, useState } from "react";
import { sidebarLinks } from "@/constants";

function Bottombar() {
const pathname = usePathname();
const [activeLink, setActiveLink] = useState(pathname);

const handleLinkClick = (route: SetStateAction<string>) => {
setActiveLink(route);
};

return (
<section className="bottombar">
    <div className="bottombar_container">
    {sidebarLinks.map((link) => {
        const isActive =
        activeLink === link.route ||
        (pathname.includes(link.route) && link.route.length > 1) ||
        pathname === link.route;

        return (
        <Link
            href={link.route}
            key={link.label}
            className={`bottombar_link ${isActive ? "active" : ""}`}
            onClick={() => handleLinkClick(link.route)}
        >
            <Image
            src={link.imgURL}
            alt={link.label}
            width={16}
            height={16}
            className="object-contain"
            />
            <p className="text-subtle-medium text-light-1 max-sm:hidden">
            {link.label.split(/\s+/)[0]}
            </p>
        </Link>
        );
    })}
    </div>
</section>
);
}

export default Bottombar;
