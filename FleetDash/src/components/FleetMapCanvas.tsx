import React, { useEffect, useRef } from 'react';
import type{ Vehicle, GeofenceZone } from '../types/Fleet';
import { CanvasFleetEngine } from '../engines/CanvasFleetEngine';

interface FleetMapCanvasProps {
  telemetryBufferRef: React.MutableRefObject<Map<string, Vehicle>>;
  geofence: GeofenceZone;
}

export const FleetMapCanvas: React.FC<FleetMapCanvasProps> = ({ telemetryBufferRef, geofence }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const engine = new CanvasFleetEngine(canvas, telemetryBufferRef, geofence);

    const updateCanvasBounds = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = container.clientWidth;
      const height = container.clientHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    updateCanvasBounds();
    engine.start();

    const resizeObserver = new ResizeObserver(() => {
      updateCanvasBounds();
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      engine.stop();
    };
  }, [telemetryBufferRef, geofence]);

  return (
    <div ref={containerRef} style={styles.container}>
      <canvas ref={canvasRef} style={styles.canvas} />
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    height: '100%',
    position: 'relative' as const,
    backgroundColor: '#0b0f19',
    overflow: 'hidden',
  },
  canvas: {
    width: '100%',
    height: '100%',
    display: 'block',
  },
};