import React, { useState, useId } from 'react';
import styles from './Input.module.css';

export default function Input({
  label,
  prefix,
  type = 'text',
  placeholder,
  value,
  onChange,
  uppercase = false,
  maxLength,
  autoFocus = false,
  helper,
}) {
  const [focused, setFocused] = useState(false);
  const id = useId();
  const hasValue = value && value.length > 0;

  return (
    <div className={`${styles.wrapper} ${focused ? styles.focused : ''}`}>
      <label className={`${styles.label} ${(focused || hasValue) ? styles.labelUp : ''}`} htmlFor={id}>
        {label}
      </label>
      <div className={styles.row}>
        {prefix && <span className={styles.prefix}>{prefix}</span>}
        <input
          id={id}
          type={type}
          className={styles.input}
          placeholder={focused ? placeholder : ''}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          maxLength={maxLength}
          autoFocus={autoFocus}
          style={{ textTransform: uppercase ? 'uppercase' : 'none' }}
        />
        {maxLength && (
          <span className={`${styles.counter} ${value && value.length > maxLength * 0.9 ? styles.counterWarn : ''}`}>
            {value ? value.length : 0}/{maxLength}
          </span>
        )}
      </div>
      {helper && <p className={styles.helper}>{helper}</p>}
    </div>
  );
}
