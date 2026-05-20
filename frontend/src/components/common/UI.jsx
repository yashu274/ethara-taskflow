/**
 * Status badge component
 */
export const StatusBadge = ({ status }) => {
  const labels = {
    'todo': 'Todo',
    'in-progress': 'In Progress',
    'completed': 'Completed',
    'overdue': 'Overdue',
    'active': 'Active',
    'on-hold': 'On Hold',
    'archived': 'Archived',
  };

  const className = {
    'todo': 'badge-todo',
    'in-progress': 'badge-in-progress',
    'completed': 'badge-completed',
    'overdue': 'badge-overdue',
    'active': 'badge-completed',
    'on-hold': 'badge-medium',
    'archived': 'badge-todo',
  }[status] || 'badge-todo';

  return (
    <span className={className} style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 10px',
      borderRadius: '100px',
      fontSize: '11.5px',
      fontWeight: 500,
      whiteSpace: 'nowrap',
    }}>
      {labels[status] || status}
    </span>
  );
};

/**
 * Priority badge component
 */
export const PriorityBadge = ({ priority }) => {
  const labels = { low: 'Low', medium: 'Medium', high: 'High', critical: 'Critical' };

  const className = {
    low: 'badge-low',
    medium: 'badge-medium',
    high: 'badge-high',
    critical: 'badge-critical',
  }[priority] || 'badge-low';

  const dots = { low: '·', medium: '·', high: '·', critical: '·' };

  return (
    <span className={className} style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 10px',
      borderRadius: '100px',
      fontSize: '11.5px',
      fontWeight: 500,
    }}>
      {labels[priority] || priority}
    </span>
  );
};

/**
 * Avatar component
 */
export const Avatar = ({ name, size = 28 }) => {
  const initials = name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '??';
  const colors = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#06b6d4'];
  const color = colors[(name?.charCodeAt(0) || 0) % colors.length];

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: `${color}20`,
      border: `1px solid ${color}30`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size * 0.35,
      fontWeight: 600,
      color: color,
      flexShrink: 0,
    }}>
      {initials}
    </div>
  );
};

/**
 * Skeleton loader
 */
export const Skeleton = ({ height = 16, width = '100%', className = '' }) => (
  <div className={`skeleton ${className}`} style={{ height, width }} />
);

/**
 * Page header component
 */
export const PageHeader = ({ title, subtitle, action }) => (
  <div className="flex items-start justify-between mb-8">
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#f5f5f0', letterSpacing: '-0.03em', marginBottom: '4px' }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{ fontSize: '13.5px', color: '#555550' }}>{subtitle}</p>
      )}
    </div>
    {action && <div>{action}</div>}
  </div>
);

/**
 * Empty state
 */
export const EmptyState = ({ icon, title, description, action }) => (
  <div className="empty-state">
    <div className="empty-state-icon">{icon}</div>
    <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#666660', marginBottom: '8px' }}>{title}</h3>
    <p style={{ fontSize: '13px', color: '#444440', marginBottom: '20px', maxWidth: '300px', margin: '0 auto 20px' }}>{description}</p>
    {action && action}
  </div>
);

/**
 * Confirm delete modal
 */
export const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, loading }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#f5f5f0', marginBottom: '8px' }}>{title}</h3>
        <p style={{ fontSize: '13.5px', color: '#666660', marginBottom: '24px' }}>{message}</p>
        <div className="flex gap-3 justify-end">
          <button className="btn-secondary" onClick={onCancel} disabled={loading}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};
