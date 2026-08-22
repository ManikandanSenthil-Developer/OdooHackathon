import React, { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  headerAction?: ReactNode;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  subtitle,
  icon,
  children,
  headerAction,
}) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '18px',
        paddingBottom: '14px',
        borderBottom: '1px solid #F3F4F6'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {icon && (
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: '#E9F1FA',
              color: '#00ABE4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {icon}
            </div>
          )}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1F2937' }}>{title}</h3>
            {subtitle && <p style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '2px' }}>{subtitle}</p>}
          </div>
        </div>

        {headerAction && <div>{headerAction}</div>}
      </div>

      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
};
