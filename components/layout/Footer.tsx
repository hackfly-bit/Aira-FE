import { cn } from '@/lib/utils'

interface FooterProps {
  className?: string
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={cn(
      "flex items-center justify-center h-12 px-4 bg-background border-t border-border",
      className
    )}>
      <p className="text-xs text-muted-foreground">
        © {currentYear} Aira Back Office. All rights reserved.
      </p>
    </footer>
  )
}