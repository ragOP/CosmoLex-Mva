import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import isArrayWithValues from '@/utils/isArrayWithValues';
import { toTitleCase } from '@/utils/namingConventions';

export function Breadcrumb({ className }) {
  const location = useLocation();
  const currentPath = location.pathname;

  // Split the path into segments
  const pathSegments = currentPath
    .split('/')
    .filter((segment) => segment !== '');

  // Build progressive links
  const breadcrumbs = pathSegments.map((segment, index) => {
    const fullPath = '/' + pathSegments.slice(0, index + 1).join('/');
    return { label: toTitleCase(segment), path: fullPath };
  });

  return (
    <nav
      className={cn(
        'flex items-center space-x-1 text-sm text-muted-foreground',
        className
      )}
    >
      {isArrayWithValues(breadcrumbs) &&
        breadcrumbs.map((crumb, index) => (
          <div key={index} className="flex items-center">
            {index < breadcrumbs.length - 1 ? (
              <Link
                to={crumb.path}
                className="hover:text-primary transition-colors"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="text-foreground font-medium">{crumb.label}</span>
            )}
            {index < breadcrumbs.length - 1 && (
              <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
            )}
          </div>
        ))}
    </nav>
  );
}
