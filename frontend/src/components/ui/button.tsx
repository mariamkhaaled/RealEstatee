import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        // 🌟 Luxury GOLD default button (NO tailwind theme dependency)
        default:
          "bg-gradient-to-r from-[#c8a96e] to-[#e8d4a8] text-[#2a1f0e] shadow-sm hover:shadow-md hover:brightness-105",

        // ⚠️ destructive stays neutral (no theme dependency needed)
        destructive:
          "bg-[#b91c1c] text-white hover:bg-[#a01818]",

        // 🤍 clean luxury outline
        outline:
          "border border-[rgba(200,169,110,0.35)] bg-[rgba(255,253,248,0.92)] text-[#6b5636] hover:bg-[rgba(200,169,110,0.08)]",

        // 🌿 soft neutral secondary (no tailwind colors)
        secondary:
          "bg-[rgba(245,239,226,0.9)] text-[#6b5636] hover:bg-[rgba(245,239,226,1)]",

        // transparent elegant hover
        ghost:
          "hover:bg-[rgba(200,169,110,0.08)] text-[#6b5636]",

        // link stays minimal
        link:
          "text-[#c8a96e] underline-offset-4 hover:underline",
      },

      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 rounded-md",
        lg: "h-10 px-6 rounded-md",
        icon: "size-9",
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
  variant,
  size,
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
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
