interface StatCardProps {
  label: string;
  value: number | string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  className?: string;
}

export default function StatCard({ label, value, color = 'blue', className = '' }: StatCardProps) {
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    red: 'text-red-600'
  };

  return (
    <div className={`flex justify-between items-center ${className}`}>
      <span className="text-gray-600">{label}</span>
      <span className={`text-2xl font-bold ${colorClasses[color]}`}>{value}</span>
    </div>
  );
}
