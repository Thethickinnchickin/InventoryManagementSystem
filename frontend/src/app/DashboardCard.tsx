import React from 'react';

type DashboardCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor?: string;
};

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, bgColor = 'bg-white' }) => {
  return (
    <div className={`flex items-center p-4 rounded-lg shadow-md ${bgColor} text-white`}>
      <div className="mr-4 text-4xl">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default DashboardCard;
