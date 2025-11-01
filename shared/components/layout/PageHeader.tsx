import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/shared/utils';
import type { Breadcrumb } from '@/shared/types';

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
  className?: string;
}

export default function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
          {breadcrumbs.map((breadcrumb, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
              {breadcrumb.current ? (
                <span className="font-medium text-foreground">
                  {breadcrumb.label}
                </span>
              ) : (
                <Link
                  href={breadcrumb.href || '#'}
                  className="hover:text-foreground transition-colors"
                >
                  {breadcrumb.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      )}

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center space-x-2">{actions}</div>}
      </div>
    </div>
  );
}