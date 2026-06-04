import { useId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function Input({ label, ...props }: InputProps) {
  const defaultId = useId();
  const inputId = props.id ?? defaultId;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="block text-xs font-medium text-slate-400 uppercase tracking-wider"
      >
        {label}
      </label>
      <input
        id={inputId}
        {...props}
        className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}
