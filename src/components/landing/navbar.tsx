"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Github, Search, Twitter } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ButtonGroup } from "../ui/button-group";
import { useSearch } from "./search-context";
import { ModeToggle } from "./theme-toggle";
import { StarsCount } from "./stars-count";

const navLinks = [
  { name: "Products", href: "#" },
  { name: "Playground", href: "#" },
  { name: "Studio", href: "/studio" },
  { name: "About me", href: "#" },
];

export default function Navbar() {
  const { query, setQuery } = useSearch();

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[95vw] sm:w-[70vw] z-50 rounded-3xl  bg-background/40 backdrop-blur-lg border-dashed border ">
      <div className="container flex w-full items-center px-4 py-3">
        {/* Logo left */}
        <div className="flex flex-1 items-center gap-2 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-2 transition-all duration-300 hover:opacity-80"
          >
            <img
              src="/logo/logo.png"
              alt="Logo"
              className="object-cover h-10 aspect-square rounded-full"
            />
            <span className="text-xl truncate font-medium tracking-tight">
              Ascii Studio
            </span>
          </Link>
        </div>

        {/* Social buttons right */}
        <nav className="flex flex-1 justify-end items-center gap-2 ">
          {/* <ButtonGroup>
            <Button variant="outline">
              <Search />
            </Button>
            <Input
              placeholder="Search component..."
              className="w-40"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </ButtonGroup> */}
          <ModeToggle />
          <Link href={"https://github.com/vansh-nagar/ASCII-Studio"}>
          <Button variant="outline" className="text-xs">
            <Github className="w-6 h-6 " /> <StarsCount/>{" "}
          </Button>
          </Link>
          <Link href={"https://x.com/vansh1029"}>
          <Button variant="outline" size="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              color="currentColor"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 21L10.5484 13.4516M21 3L13.4516 10.5484M13.4516 10.5484L8 3H3L10.5484 13.4516M13.4516 10.5484L21 21H16L10.5484 13.4516" />
            </svg>
          </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
