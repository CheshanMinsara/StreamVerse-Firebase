"use client";

import Link from "next/link";
import { Search, Film, Tv, Menu, X, Megaphone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Clapperboard } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { searchMedia } from "@/lib/tmdb";
import { MediaResult } from "@/lib/types";
import SearchResultsDropdown from "../search/search-results-dropdown";

const navLinks = [
  { href: "/discover/movie", label: "Movies", icon: Film },
  { href: "/discover/tv", label: "TV Series", icon: Tv },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [results, setResults] = useState<MediaResult[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    // Only perform search if there is a debounced query
    if (debouncedSearchQuery) {
      searchMedia(debouncedSearchQuery, 1).then(data => {
        setResults(data.results.slice(0, 7)); // Limit to 7 results
        setIsDropdownOpen(true);
      });
    } else {
      setResults([]);
      setIsDropdownOpen(false);
    }
  }, [debouncedSearchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(searchQuery.trim()){
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsDropdownOpen(false);
    }
  }

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);
  
  useEffect(() => {
    // Make sure to sync the search input with the URL query on navigation
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const NavLinks = ({onLinkClick}: {onLinkClick?: () => void}) => (
    <>
      {navLinks.map((link) => {
        const isActive = pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => {
              setIsMobileMenuOpen(false);
              onLinkClick?.();
            }}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:bg-secondary/50 hover:text-secondary-foreground"
            )}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Clapperboard className="h-6 w-6 text-accent" />
            <span className="hidden font-bold sm:inline-block font-headline text-lg">
              StreamVerse
            </span>
          </Link>
          <nav className="hidden items-center space-x-2 md:flex">
             <NavLinks />
          </nav>
        </div>

        <div className="hidden md:flex flex-1 justify-center">
            <a href="mailto:cheshanminsara@gmail.com" className="group flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-yellow-500 group-hover:animate-pulse" />
                <span className="text-sm font-semibold text-yellow-500/90 group-hover:text-yellow-500 transition-colors">For sale! Inquire at cheshanminsara@gmail.com</span>
            </a>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2 md:flex-none">
           <div className="w-full flex-1 md:w-auto md:flex-none" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search movies and shows..."
                  className="pl-9 w-full md:w-80"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsDropdownOpen(searchQuery.length > 0 && results.length > 0)}
                />
                {isDropdownOpen && results.length > 0 && (
                  <SearchResultsDropdown 
                    results={results}
                    query={searchQuery} 
                    onClose={() => setIsDropdownOpen(false)}
                  />
                )}
              </form>
          </div>
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col gap-4 py-6">
                  <Link href="/" className="mb-4 flex items-center space-x-2 px-3">
                     <Clapperboard className="h-6 w-6 text-accent" />
                     <span className="font-bold font-headline text-lg">
                       StreamVerse
                     </span>
                  </Link>
                  <nav className="flex flex-col gap-2">
                    <NavLinks onLinkClick={() => setIsMobileMenuOpen(false)} />
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
