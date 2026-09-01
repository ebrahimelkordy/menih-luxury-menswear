import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-concrete flex flex-col items-center justify-center section-padding-lg">
      <div className="h-1.5 w-16 bg-safety mb-8" />
      <div className="tech-label-sm text-foreground/40 mb-4">ERROR 404</div>
      <h1 className="font-display text-display-md font-bold tracking-tightest text-graphite mb-4">
        NOT FOUND.
      </h1>
      <p className="text-sm text-foreground/50 mb-8 max-w-sm text-center">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="group inline-flex items-center gap-3 border-b-2 border-foreground pb-1 hover:border-safety transition-colors"
      >
        <span className="tech-label-sm font-medium group-hover:text-safety transition-colors">← BACK TO HOME</span>
      </Link>
    </div>
  );
}
