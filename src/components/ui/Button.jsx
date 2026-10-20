import { cn } from '../../lib/utils/cn';

export function Button({
  as: Component = 'button',
  variant = 'primary',
  size,
  block = false,
  className,
  children,
  type,
  ...props
}) {
  const isButton = Component === 'button';

  return (
    <Component
      className={cn(
        'btn',
        `btn--${variant}`,
        size && `btn--${size}`,
        block && 'btn--block',
        className
      )}
      {...(isButton ? { type: type || 'button' } : {})}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Button;
