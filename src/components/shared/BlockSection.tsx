import React, { useState } from 'react';

interface BlockSectionProps {
  title: string;
  children: React.ReactNode;
  defaultCollapsed?: boolean;
  visible?: boolean;
}

export const BlockSection: React.FC<BlockSectionProps> = ({
  title,
  children,
  defaultCollapsed = false,
  visible = true,
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  if (!visible) return null;

  return (
    <div className="block-section">
      <div className="block-header" onClick={() => setCollapsed(!collapsed)}>
        <h3>{title}</h3>
        <span className="toggle">{collapsed ? '▸ Развернуть' : '▾ Свернуть'}</span>
      </div>
      <div className={`block-body${collapsed ? ' collapsed' : ''}`}>
        {children}
      </div>
    </div>
  );
};
