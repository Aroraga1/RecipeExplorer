import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-border bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="text-xl font-semibold">
          Recipe Explorer
        </Link>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link to="/">Home</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/find">Find</Link>
          </Button>
          <Button asChild>
            <Link to="/recipe/new">Add Recipe</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;

