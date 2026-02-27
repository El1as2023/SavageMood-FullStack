interface  InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}


export function Input({label, ...props}: InputProps) {
    return (
 <div className="w-full">
     <label className="block text-sm font-medium text-zinc-400 mb 1.5 ml-1">
         {label}
     </label>
     <input
     {...props}
     className="w-full bg-zinc-900 text-white border border-zinc-800 rounded-lg p-3 placeholder:text-zinc-600 outline-none transition-all duration-200 focus:border-red-600 focus:ring-1 focus:ring-red-600
     hover:border-zinc-700"
     />

 </div>
    );
}