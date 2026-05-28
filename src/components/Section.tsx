import { type ReactNode } from "react";

export function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className = "",
}: {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`py-20 lg:py-28 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {(eyebrow || title || subtitle) && (
          <div className="max-w-2xl mx-auto text-center mb-14 animate-fade-up">
            {eyebrow && (
              <span className="inline-block text-xs font-semibold tracking-widest uppercase text-accent mb-3 px-3 py-1 rounded-full bg-accent/10">
                {eyebrow}
              </span>
            )}
            {title && (
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-4 text-base sm:text-lg text-muted-foreground">{subtitle}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
