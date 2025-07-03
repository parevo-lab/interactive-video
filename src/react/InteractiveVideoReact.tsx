import React, { useEffect, useRef } from 'react';
import { InteractiveVideo } from '../core';
import type { InteractiveVideoOptions } from '../core';

export interface InteractiveVideoReactProps extends Omit<InteractiveVideoOptions, 'src'> {
  src: string;
  className?: string;
}

export const InteractiveVideoReact: React.FC<InteractiveVideoReactProps> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<InteractiveVideo | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create interactive video instance
    instanceRef.current = new InteractiveVideo(containerRef.current, props);

    return () => {
      if (instanceRef.current) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
    };
  }, []); // Sadece mount/unmount'ta çalışsın

  return (
    <div 
      ref={containerRef}
      className={props.className}
      style={{ 
        width: props.width || 640, 
        height: props.height || 360 
      }}
    />
  );
};