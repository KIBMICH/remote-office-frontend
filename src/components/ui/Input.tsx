import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: "light" | "dark";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", variant = "light", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-3 py-2 border rounded-md shadow-sm
            focus:outline-none focus:ring-2
            ${variant === 'dark'
              ? 'bg-gray-950/60 text-gray-200 placeholder-gray-500 border-gray-800 focus:ring-blue-600 focus:border-blue-600'
              : 'placeholder-gray-400 border-gray-300 focus:ring-blue-500 focus:border-blue-500'}
            ${error 
              ? (variant === 'dark' ? 'border-red-500 focus:ring-red-600 focus:border-red-600' : 'border-red-300 focus:ring-red-500 focus:border-red-500') 
              : ''
            }
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
