import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-slate-900 text-slate-50 hover:bg-slate-900/80",
        secondary:
          "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80",
        destructive:
          "border-transparent bg-red-500 text-slate-50 hover:bg-red-500/80",
        outline: "text-slate-950",
        // New variants
        accent: "border-transparent bg-accent text-accent-foreground hover:bg-accent/80",
        coral: "border-transparent bg-brand-coral text-white hover:bg-brand-coral/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={`${badgeVariants({ variant })} ${className}`} {...props} />
  )
}

export { Badge, badgeVariants }
