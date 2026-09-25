import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex items-center flex-wrap gap-2 text-xs md:text-sm text-taupe">
        <li>
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-terracotta transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-2">
              <ChevronRight className="w-3.5 h-3.5 text-sand shrink-0" />
              {isLast || !item.href ? (
                <span className="font-medium text-espresso font-serif truncate max-w-[200px] md:max-w-[300px]">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-terracotta transition-colors truncate max-w-[150px]"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
