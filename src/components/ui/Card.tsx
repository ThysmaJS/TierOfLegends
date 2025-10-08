interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  as?: keyof JSX.IntrinsicElements;
}

export default function Card({ children, className = '', padding = true, shadow = 'sm', as: Tag = 'div' }: CardProps) {
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };

  return (
    <Tag className={`rounded-lg ${shadowClasses[shadow]} ${padding ? 'p-6' : ''} ${className}`}>
      {children}
    </Tag>
  );
}
