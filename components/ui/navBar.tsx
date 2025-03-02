"use client"

import React from "react"

import Link from "next/link"
import { Menu, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useSearch } from "@/lib/hooks/use-search"
import { SearchResults } from "@/components/ui/search-results"

export function Navbar({ onCoinSelect }: { onCoinSelect: (coinId: string) => void }) {
  const { searchQuery, setSearchQuery, results, loading, error, handleSearch } = useSearch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const searchForm = (
    <form onSubmit={handleSubmit} className="w-full max-w-sm lg:max-w-md xl:max-w-lg">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search cryptocurrencies..."
          className="w-full bg-background pl-8 md:w-[300px] lg:w-[400px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearch(searchQuery);
            }
          }}
        />
        <Button 
          type="submit" 
          variant="default" 
          size="default" 
          className="absolute right-0 top-0 h-full rounded-l-none"
          onClick={() => handleSearch(searchQuery)}
        >
          Search
        </Button>
      </div>
      <div className="relative">
        <SearchResults 
          results={results} 
          isLoading={loading} 
          onCoinSelect={onCoinSelect} 
        />
        {error && (
          <div className="absolute w-full bg-destructive/10 text-destructive p-2 rounded-md mt-2">
            {error}
          </div>
        )}
      </div>
    </form>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center md:mr-6">
          <Link href="/" className="flex items-center space-x-2 transition-colors hover:text-foreground/80">
            <span className="text-xl font-bold">crypto</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
     
          <Link href="/products" className="transition-colors hover:text-foreground/80">
            Products
          </Link>
          <Link href="/about" className="transition-colors hover:text-foreground/80">
            About
          </Link>
          <Link href="/contact" className="transition-colors hover:text-foreground/80">
            Contact
          </Link>
        </nav>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 items-center justify-end">
          {searchForm}
        </div>

        {/* Mobile Search and Menu */}
        <div className="flex flex-1 items-center justify-end space-x-2 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="pt-16">
              {searchForm}
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col space-y-4 mt-8">
                <Link href="/" className="text-lg font-medium">
                  Home
                </Link>
                <Link href="/products" className="text-lg font-medium">
                  Products
                </Link>
                <Link href="/about" className="text-lg font-medium">
                  About
                </Link>
                <Link href="/contact" className="text-lg font-medium">
                  Contact
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

