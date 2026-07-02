import React, { useState } from 'react';

export default function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  prefix,
  className = ''
}) {
  const [isFocused, setIsFocused] = useState(false);

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%',
    marginBottom: '16px'
  };

  const inputWrapperStyle = {
    display: 'flex',
    alignItems: 'center',
    border: isFocused ? '2px solid var(--primary-container)' : '1px solid rgba(26, 26, 26, 0.2)',
    borderRadius: 'var(--radius-lg)',
    backgroundColor: 'var(--surface-container-lowest)',
    overflow: 'hidden',
    transition: 'border-color 0.2s ease'
  };

  const inputStyle = {
    flex: 1,
    border: 'none',
    outline: 'none',
    padding: '14px 16px',
    backgroundColor: 'transparent',
    color: 'var(--on-surface)'
  };

  return (
    <div style={containerStyle} className={className}>
      {label && <label className="text-label-caps" style={{ color: 'var(--on-surface-variant)' }}>{label}</label>}
      <div style={inputWrapperStyle}>
        {prefix && (
          <div style={{ paddingLeft: '16px', color: 'var(--on-surface)', fontWeight: 500 }}>
            {prefix}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={inputStyle}
          className="text-body-md"
        />
      </div>
    </div>
  );
}
