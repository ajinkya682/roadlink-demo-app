import React, { useId } from 'react';
import { cn } from '../lib/cn';

export default function Input({
  label,
  value,
  onChange,
  placeholder,
  helper,
  error,
  type = 'text',
  prefix,
  suffix,
  maxLength,
  autoFocus,
  className = '',
  inputClassName = '',
  ...rest
}) {
  const id = useId();

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label
          htmlFor={id}
          className="font-body text-label-caps text-on-surface-muted uppercase tracking-widest"
        >
          {label}
        </label>
      )}

      <div
        className={cn(
          'flex items-center gap-2 rounded-lg border bg-white',
          'transition-all duration-150',
          error
            ? 'border-alert-red ring-2 ring-alert-red/20'
            : 'border-outline-light focus-within:border-navy focus-within:ring-2 focus-within:ring-navy/15',
        )}
      >
        {prefix && (
          <span className="pl-4 font-body text-body-md text-on-surface-muted font-medium whitespace-nowrap select-none">
            {prefix}
          </span>
        )}

        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          autoFocus={autoFocus}
          className={cn(
            'flex-1 min-w-0 py-4 px-4 bg-transparent font-body text-body-md text-on-surface',
            'placeholder:text-outline focus:outline-none',
            prefix && 'pl-0',
            suffix && 'pr-0',
            inputClassName,
          )}
          {...rest}
        />

        {suffix && (
          <span className="pr-4 font-body text-body-sm text-on-surface-muted whitespace-nowrap select-none">
            {suffix}
          </span>
        )}

        {maxLength && value !== undefined && (
          <span className="pr-4 font-body text-label-caps text-outline whitespace-nowrap tabular-nums">
            {value.length}/{maxLength}
          </span>
        )}
      </div>

      {(helper || error) && (
        <p className={cn('font-body text-body-sm', error ? 'text-alert-red' : 'text-on-surface-muted')}>
          {error || helper}
        </p>
      )}
    </div>
  );
}
