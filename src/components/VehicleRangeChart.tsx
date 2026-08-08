import React, { useEffect, useRef } from 'react';
import type { Vehicle, GeofenceZone } from '../types/Fleet';

interface VehicleRangeChartProps {
  telemetryBufferRef: React.MutableRefObject<Map<string, Vehicle>>;
  geofence: GeofenceZone;
}

export const VehicleRangeChart: React.FC<VehicleRangeChartProps> = ({ telemetryBufferRef, geofence }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    let animationId: number;

    const draw = () => {
      const buffer = telemetryBufferRef.current;
      let insideCount = 0;
      let outsideCount = 0;

      buffer.forEach((vehicle) => {
        const isInside =
          vehicle.lat >= geofence.minLat && vehicle.lat <= geofence.maxLat &&
          vehicle.lng >= geofence.minLng && vehicle.lng <= geofence.maxLng;
        if (isInside) {
          insideCount++;
        } else {
          outsideCount++;
        }
      });

      const total = insideCount + outsideCount;

      // Clear
      ctx.clearRect(0, 0, width, height);

      // Background
      ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
      ctx.beginPath();
      ctx.roundRect(0, 0, width, height, 10);
      ctx.fill();

      // Title
      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 10px system-ui, -apple-system, sans-serif';
      ctx.fillText('VEHICLE RANGE DISTRIBUTION', 16, 24);

      // Donut Chart
      const centerX = 130;
      const centerY = height / 2 + 10;
      const outerRadius = 58;
      const innerRadius = 38;
      const startAngle = -Math.PI / 2;

      const insideAngle = total > 0 ? (insideCount / total) * Math.PI * 2 : 0;
      const outsideAngle = total > 0 ? (outsideCount / total) * Math.PI * 2 : 0;

      // Inside arc (green)
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, startAngle, startAngle + insideAngle);
      ctx.arc(centerX, centerY, innerRadius, startAngle + insideAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = 'rgba(16, 185, 129, 0.85)';
      ctx.fill();

      // Outside arc (blue)
      if (outsideAngle > 0) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius, startAngle + insideAngle, startAngle + insideAngle + outsideAngle);
        ctx.arc(centerX, centerY, innerRadius, startAngle + insideAngle + outsideAngle, startAngle + insideAngle, true);
        ctx.closePath();
        ctx.fillStyle = 'rgba(56, 189, 248, 0.85)';
        ctx.fill();
      }

      // Center text
      ctx.fillStyle = '#f8fafc';
      ctx.font = '700 18px "SF Mono", "Fira Code", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${total}`, centerX, centerY - 4);
      ctx.fillStyle = '#64748b';
      ctx.font = '500 8px system-ui, -apple-system, sans-serif';
      ctx.fillText('TOTAL VEHICLES', centerX, centerY + 14);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';

      // Legend
      const legendX = 220;
      const legendY = 42;

      // In range
      ctx.fillStyle = 'rgba(16, 185, 129, 0.85)';
      ctx.beginPath();
      ctx.arc(legendX, legendY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '600 12px system-ui, -apple-system, sans-serif';
      ctx.fillText('In Range', legendX + 14, legendY + 4);
      ctx.fillStyle = '#10b981';
      ctx.font = '700 16px "SF Mono", "Fira Code", monospace';
      ctx.fillText(`${insideCount}`, legendX + 100, legendY + 4);
      ctx.fillStyle = '#475569';
      ctx.font = '500 9px system-ui, -apple-system, sans-serif';
      ctx.fillText(`(${total > 0 ? ((insideCount / total) * 100).toFixed(1) : '0'}%)`, legendX + 140, legendY + 4);

      // Out of range
      const legendY2 = legendY + 28;
      ctx.fillStyle = 'rgba(56, 189, 248, 0.85)';
      ctx.beginPath();
      ctx.arc(legendX, legendY2, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '600 12px system-ui, -apple-system, sans-serif';
      ctx.fillText('Out of Range', legendX + 14, legendY2 + 4);
      ctx.fillStyle = '#38bdf8';
      ctx.font = '700 16px "SF Mono", "Fira Code", monospace';
      ctx.fillText(`${outsideCount}`, legendX + 100, legendY2 + 4);
      ctx.fillStyle = '#475569';
      ctx.font = '500 9px system-ui, -apple-system, sans-serif';
      ctx.fillText(`(${total > 0 ? ((outsideCount / total) * 100).toFixed(1) : '0'}%)`, legendX + 140, legendY2 + 4);

      // Zone name
      ctx.fillStyle = '#64748b';
      ctx.font = '500 9px system-ui, -apple-system, sans-serif';
      ctx.fillText(`Zone: ${geofence.name.toUpperCase()}`, legendX, legendY2 + 30);

      // Bar chart summary at bottom
      const barY = height - 30;
      const barMaxWidth = width - 40;
      const insideBarWidth = total > 0 ? (insideCount / total) * barMaxWidth : 0;

      ctx.fillStyle = 'rgba(51, 65, 85, 0.3)';
      ctx.beginPath();
      ctx.roundRect(20, barY, barMaxWidth, 8, 4);
      ctx.fill();

      if (insideBarWidth > 0) {
        const gradient = ctx.createLinearGradient(20, barY, 20 + insideBarWidth, barY);
        gradient.addColorStop(0, '#10b981');
        gradient.addColorStop(0.5, '#34d399');
        gradient.addColorStop(1, '#38bdf8');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(20, barY, insideBarWidth, 8, 4);
        ctx.fill();
      }

      // Labels on bar
      ctx.fillStyle = '#475569';
      ctx.font = '500 8px system-ui, -apple-system, sans-serif';
      ctx.fillText('In Range', 20, barY - 6);
      ctx.fillText('Out of Range', width - 80, barY - 6);
      ctx.textAlign = 'right';
      ctx.fillText(`${insideCount}`, 20 + insideBarWidth - 4, barY + 14);
      ctx.textAlign = 'left';

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [telemetryBufferRef, geofence]);

  return (
    <div ref={containerRef} style={styles.container}>
      <canvas ref={canvasRef} style={styles.canvas} />
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    height: '220px',
    position: 'relative',
    minHeight: '220px',
  },
  canvas: {
    width: '100%',
    height: '100%',
    display: 'block',
  },
};