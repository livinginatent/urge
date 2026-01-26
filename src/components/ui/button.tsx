import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold uppercase tracking-wider transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#E11D48] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]",
  {
    variants: {
      variant: {
        default: "bg-[#1a1a1a] text-[#a1a1aa] border-2 border-[#27272a] hover:border-[#E11D48] hover:text-white active:translate-x-[2px] active:translate-y-[2px]",
        destructive:
          "bg-[#E11D48] text-white border-2 border-[#E11D48] hover:bg-[#be123c] active:translate-x-[2px] active:translate-y-[2px] shadow-[4px_4px_0_0_#27272a] hover:shadow-[2px_2px_0_0_#27272a]",
        outline:
          "border-2 border-[#27272a] bg-transparent text-[#a1a1aa] hover:border-[#E11D48] hover:text-white",
        secondary:
          "bg-[#0a0a0a] text-[#a1a1aa] border-2 border-[#27272a] hover:text-white",
        ghost:
          "text-[#a1a1aa] hover:text-white hover:bg-[#1a1a1a]",
        link: "text-[#E11D48] underline-offset-4 hover:underline",
        commitment:
          "bg-[#E11D48] text-white border-2 border-[#E11D48] font-bold text-base tracking-widest shadow-[6px_6px_0_0_#ffffff] hover:shadow-[3px_3px_0_0_#ffffff] active:shadow-none active:translate-x-[6px] active:translate-y-[6px] transition-all duration-100",
      },
      size: {
        default: "h-11 px-6 py-2",
        xs: "h-7 gap-1 px-3 text-xs",
        sm: "h-9 px-4",
        lg: "h-14 px-10 text-base",
        xl: "h-16 px-12 text-lg",
        icon: "size-11",
        "icon-xs": "size-7",
        "icon-sm": "size-9",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
