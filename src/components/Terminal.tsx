/**
 * Terminal Component
 * Terminal interactif avec effet typing
 * Phase 4: Signature Elements
 */

import { useState, useEffect } from 'react';
import type { ReactElement } from 'react';

interface TerminalLine {
  type: 'command' | 'output';
  content: string;
  delay?: number;
}

interface TerminalProps {
  /**
   * Lignes du terminal
   */
  lines: TerminalLine[];

  /**
   * Prompt du terminal
   * @default "$"
   */
  prompt?: string;

  /**
   * Classes CSS additionnelles
   */
  className?: string;
}

export default function Terminal({
  lines,
  prompt = '$',
  className = '',
}: TerminalProps): ReactElement {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [typingText, setTypingText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  useEffect(() => {
    if (visibleLines >= lines.length) {
      return;
    }

    const currentLine = lines[visibleLines];
    const delay = currentLine.delay ?? 0;

    const timer = setTimeout(() => {
      if (currentLine.type === 'command') {
        // Typing effect for commands
        setIsTyping(true);
        let charIndex = 0;

        const typingInterval = setInterval(() => {
          if (charIndex <= currentLine.content.length) {
            setTypingText(currentLine.content.slice(0, charIndex));
            charIndex++;
          } else {
            clearInterval(typingInterval);
            setIsTyping(false);
            setTypingText('');
            setVisibleLines((prev) => prev + 1);
          }
        }, 50); // 50ms per character

        return () => clearInterval(typingInterval);
      } else {
        // Output appears instantly
        setVisibleLines((prev) => prev + 1);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [visibleLines, lines]);

  return (
    <div
      className={`glass-effect rounded-xl p-4 md:p-6 font-mono text-sm overflow-x-auto ${className}`}
    >
      {/* Terminal Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--color-neutral-50)]/10">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="ml-2 text-neutral-400 text-xs">terminal</span>
      </div>

      {/* Terminal Content */}
      <div className="space-y-2">
        {lines.slice(0, visibleLines).map((line, index) => (
          <div key={index}>
            {line.type === 'command' ? (
              <div className="flex items-center gap-2">
                <span className="text-primary-400">{prompt}</span>
                <span className="text-neutral-200">{line.content}</span>
              </div>
            ) : (
              <div className="text-neutral-400 ml-4 whitespace-pre-line break-words">
                {line.content}
              </div>
            )}
          </div>
        ))}

        {/* Current typing line */}
        {isTyping && (
          <div className="flex items-center gap-2">
            <span className="text-primary-400">{prompt}</span>
            <span className="text-neutral-200">
              {typingText}
              <span className="animate-pulse">▊</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
