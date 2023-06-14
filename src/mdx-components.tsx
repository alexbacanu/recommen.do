import type { MDXComponents } from "mdx/types";

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including components from
// other libraries.

// This file is required to use MDX in `app` directory.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    h1: ({ children }) => <h1 className="text-3xl font-semibold">{children}</h1>,
    h2: ({ children }) => <h1 className="text-2xl font-semibold">{children}</h1>,
    a: ({ children, ...props }) => (
      <a className="text-primary" {...props}>
        {children}
      </a>
    ),
    ...components,
  };
}
