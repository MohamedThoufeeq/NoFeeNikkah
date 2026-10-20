import { cn } from '../../lib/utils/cn';
import { initials } from '../../lib/utils/format';

export function Avatar({ src, alt = '', name = '', size = 'md', className }) {
  const showImage = Boolean(src);

  return (
    <span
      className={cn(
        'avatar',
        `avatar--${size}`,
        !showImage && 'avatar--placeholder',
        className
      )}
    >
      {showImage ? <img src={src} alt={alt} loading="lazy" /> : <span aria-hidden="true">{initials(name)}</span>}
    </span>
  );
}

export default Avatar;
