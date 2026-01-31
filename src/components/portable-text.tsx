"use client";

import { PortableText as SanityPortableText, PortableTextComponents } from "next-sanity";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

const components: PortableTextComponents = {
  // Block styles
  block: {
    h1: ({ children }) => (
      <h1 className="text-4xl md:text-5xl font-bold text-white tracking-brutal mb-6 mt-12 first:mt-0">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl md:text-4xl font-bold text-white tracking-brutal mb-4 mt-10 first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl md:text-3xl font-bold text-white tracking-brutal mb-3 mt-8 first:mt-0">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl md:text-2xl font-bold text-white tracking-brutal mb-3 mt-6 first:mt-0">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="text-[#a1a1aa] text-base md:text-lg leading-relaxed mb-6 font-mono">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[#E11D48] pl-6 py-4 my-6 bg-[#0a0a0a] border-2 border-t-2 border-b-2 border-r-0">
        <p className="text-[#a1a1aa] text-lg italic font-mono">{children}</p>
      </blockquote>
    ),
  },
  // Marks
  marks: {
    strong: ({ children }) => (
      <strong className="font-bold text-white">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic text-[#a1a1aa]">{children}</em>
    ),
    link: ({ children, value }) => {
      const href = value?.href || "";
      const isExternal = href.startsWith("http");
      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-[#E11D48] underline hover:text-[#be123c] transition-colors font-mono"
        >
          {children}
        </a>
      );
    },
    code: ({ children }) => (
      <code className="bg-[#0a0a0a] border border-[#27272a] px-2 py-1 text-[#E11D48] font-mono text-sm">
        {children}
      </code>
    ),
  },
  // Lists
  list: {
    bullet: ({ children }) => (
      <ul className="list-none space-y-3 mb-6 pl-0">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-none space-y-3 mb-6 pl-0 counter-reset-[list-counter]">
        {children}
      </ol>
    ),
  },
  // List items
  listItem: {
    bullet: ({ children }) => (
      <li className="flex items-start gap-3 text-[#a1a1aa] font-mono">
        <span className="w-1 h-1 bg-[#E11D48] mt-2 flex-shrink-0" />
        <span className="flex-1">{children}</span>
      </li>
    ),
    number: ({ children }) => (
      <li className="flex items-start gap-3 text-[#a1a1aa] font-mono">
        <span className="text-[#E11D48] font-bold flex-shrink-0">{children}</span>
      </li>
    ),
  },
  // Custom types
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      
      const imageUrl = urlFor(value)
        .width(1200)
        .height(800)
        .url();
      
      return (
        <figure className="my-8 border-2 border-[#27272a] bg-[#0a0a0a] p-2">
          <div className="relative w-full aspect-video">
            <Image
              src={imageUrl}
              alt={value.alt || ""}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          </div>
          {value.caption && (
            <figcaption className="text-sm text-[#52525b] mt-2 px-2 font-mono">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

interface PortableTextProps {
  value: any;
}

export function PortableText({ value }: PortableTextProps) {
  if (!value || !Array.isArray(value)) return null;
  
  return <SanityPortableText value={value} components={components} />;
}
