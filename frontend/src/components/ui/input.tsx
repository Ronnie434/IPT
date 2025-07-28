import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const inputVariants = cva(
  "flex w-full rounded-xl border text-sm transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input bg-background hover:border-blue-300 dark:hover:border-blue-600 focus-visible:ring-ring focus-visible:border-blue-500 dark:focus-visible:border-blue-400",
        glass: "glass-input border-white/20 text-white placeholder:text-white/60 focus-visible:ring-blue-400/50 focus-visible:border-blue-400/50",
        outline: "border-2 border-gray-200 dark:border-gray-700 bg-transparent hover:border-blue-300 dark:hover:border-blue-600 focus-visible:ring-blue-500/20 focus-visible:border-blue-500",
        filled: "border-transparent bg-gray-100 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus-visible:ring-blue-500/20 focus-visible:bg-background",
      },
      size: {
        default: "h-11 px-4 py-2.5",
        sm: "h-9 px-3 py-2 text-xs",
        lg: "h-13 px-5 py-3 text-base",
        xl: "h-16 px-6 py-4 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string
  floatingLabel?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, type, label, floatingLabel = false, leftIcon, rightIcon, error, ...props }, ref) => {
    const [focused, setFocused] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(false)
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0)
      props.onChange?.(e)
    }
    
    const showFloatingLabel = floatingLabel && (focused || hasValue || props.value || props.defaultValue)
    
    if (floatingLabel && label) {
      return (
        <div className="relative w-full">
          <div className="relative">
            {leftIcon && (
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10">
                {leftIcon}
              </div>
            )}
            <input
              type={type}
              className={cn(
                inputVariants({ variant, size }),
                leftIcon && "pl-10",
                rightIcon && "pr-10",
                error && "border-red-500 focus-visible:ring-red-500/20",
                className
              )}
              ref={ref}
              onFocus={(e) => {
                setFocused(true)
                props.onFocus?.(e)
              }}
              onBlur={(e) => {
                setFocused(false)
                props.onBlur?.(e)
              }}
              onChange={handleChange}
              placeholder={showFloatingLabel ? "" : props.placeholder}
              {...props}
            />
            {rightIcon && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                {rightIcon}
              </div>
            )}
            <label
              className={cn(
                "absolute left-3 transition-all duration-200 pointer-events-none",
                leftIcon && "left-10",
                showFloatingLabel
                  ? "top-2 text-xs text-blue-600 dark:text-blue-400 font-medium"
                  : "top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground"
              )}
            >
              {label}
            </label>
          </div>
          {error && (
            <p className="mt-1 text-xs text-red-500 animate-slide-down">{error}</p>
          )}
        </div>
      )
    }
    
    return (
      <div className="w-full">
        {label && !floatingLabel && (
          <label className="block text-sm font-medium text-foreground mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              inputVariants({ variant, size }),
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-red-500 focus-visible:ring-red-500/20",
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-xs text-red-500 animate-slide-down">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }