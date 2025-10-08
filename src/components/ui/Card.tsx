interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

export default function Card({ children, className = '', padding = true, shadow = 'sm' }: CardProps) {
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };

  return (
    <div className={`bg-white rounded-lg ${shadowClasses[shadow]} ${padding ? 'p-6' : ''} ${className}`}>
      {children}
    </div>
  );
}
