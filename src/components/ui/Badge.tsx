interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'purple' | 'green' | 'red' | 'yellow' | 'gray';
  size?: 'sm' | 'md';
  className?: string;
}

export default function Badge({ children, variant = 'blue', size = 'md', className = '' }: BadgeProps) {
  const variantClasses = {
    blue: 'bg-blue-500/20 text-blue-300 ring-1 ring-inset ring-blue-400/30',
    purple: 'bg-purple-500/20 text-purple-300 ring-1 ring-inset ring-purple-400/30',
    green: 'bg-green-500/20 text-green-300 ring-1 ring-inset ring-green-400/30',
    red: 'bg-red-500/20 text-red-300 ring-1 ring-inset ring-red-400/30',
    yellow: 'bg-yellow-500/20 text-yellow-300 ring-1 ring-inset ring-yellow-400/30',
    gray: 'bg-white/10 text-gray-300 ring-1 ring-inset ring-white/10'
  } as const;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm'
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium backdrop-blur-sm ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  );
}
