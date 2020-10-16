import { FC, HTMLAttributes } from 'react';

const Words: FC<HTMLAttributes<HTMLSpanElement> & {
  children: string;
  duration?: string;
  delay?: string;
}> = ({ children, duration, delay, ...props }) => {
  return (
    <>
      <animate-presence {...props}>
        {children.split(' ').map(word => (
          <span
            style={{ animationDuration: duration, animationDelay: delay }}
            className="word"
          >
            {word}{' '}
          </span>
        ))}
      </animate-presence>
      <style jsx>{`
        animate-presence {
          white-space: pre-wrap;
        }

        .word {
          display: inline-block;
        }

        .word[data-enter] {
          animation: enter var(--duration, 300ms) var(--delay, 0s)
            cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
        }

        @keyframes enter {
          from {
            opacity: 0;
            transform: translateY(0.5ex);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default Words;
