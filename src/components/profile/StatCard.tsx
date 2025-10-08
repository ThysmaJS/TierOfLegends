interface StatCardProps {
  label: string;
  value: number | string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  className?: string;
}

export default function StatCard({ label, value, color = 'blue', className = '' }: StatCardProps) {
  const colorClasses = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
    orange: 'text-orange-400',
    red: 'text-red-400'
  } as const;

  return (
    <div className={`flex justify-between items-center ${className}`}>
      <span className="text-gray-400">{label}</span>
      <span className={`text-2xl font-bold ${colorClasses[color]}`}>{value}</span>
    </div>
  );
}
