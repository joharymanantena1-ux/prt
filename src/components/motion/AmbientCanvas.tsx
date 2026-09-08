import { useEffect, useRef } from "react";

interface AmbientCanvasProps {
  className?: string;
  interactive?: boolean;
}

export const AmbientCanvas = ({ className = "", interactive = true }: AmbientCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let animId = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Mouse coordinates (normalized -1 to 1)
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    // Handle mouse move
    const handlePointerMove = (e: PointerEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / width;
      const y = (e.clientY - rect.top) / height;
      targetMouseX = (x - 0.5) * 2;
      targetMouseY = (y - 0.5) * 2;
    };

    if (interactive) {
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
    }

    // Interactive orbs / nodes with physics
    interface Node {
      baseX: number;
      baseY: number;
      radius: number;
      vx: number;
      vy: number;
      phase: number;
      speed: number;
    }

    const nodeCount = Math.min(Math.floor(width / 70), 22);
    const nodes: Node[] = Array.from({ length: nodeCount }, (_, i) => ({
      baseX: (Math.random() * 0.9 + 0.05) * width,
      baseY: (Math.random() * 0.85 + 0.08) * height,
      radius: Math.random() * 1.8 + 1.2,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      phase: (i / nodeCount) * Math.PI * 2,
      speed: 0.0015 + Math.random() * 0.001,
    }));

    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    let lastTime = performance.now();

    const render = (time: number) => {
      if (!isVisible) {
        animId = requestAnimationFrame(render);
        return;
      }

      const dt = Math.min(time - lastTime, 40);
      lastTime = time;

      // Smooth mouse damping
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains("dark");

      // Dynamic ambient focal glow responding to mouse
      const glowCenterX = width * 0.5 + mouseX * width * 0.15;
      const glowCenterY = height * 0.38 + mouseY * height * 0.12;
      const glowRadius = Math.max(width, height) * 0.45;

      const radialGrad = ctx.createRadialGradient(
        glowCenterX,
        glowCenterY,
        0,
        glowCenterX,
        glowCenterY,
        glowRadius
      );

      if (isDark) {
        radialGrad.addColorStop(0, "rgba(56, 114, 237, 0.08)");
        radialGrad.addColorStop(0.5, "rgba(36, 71, 168, 0.03)");
        radialGrad.addColorStop(1, "rgba(17, 23, 34, 0)");
      } else {
        radialGrad.addColorStop(0, "rgba(36, 71, 168, 0.05)");
        radialGrad.addColorStop(0.6, "rgba(111, 40, 58, 0.015)");
        radialGrad.addColorStop(1, "rgba(241, 236, 226, 0)");
      }

      ctx.fillStyle = radialGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle dynamic particles
      const particleColor = isDark
        ? "rgba(148, 185, 255, "
        : "rgba(36, 71, 168, ";

      const lineColor = isDark
        ? "rgba(96, 145, 240, "
        : "rgba(50, 80, 160, ";

      const currentNodes: { x: number; y: number; r: number }[] = [];

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (!prefersReducedMotion) {
          node.phase += node.speed * dt;
          node.baseX += node.vx * (dt / 16);
          node.baseY += node.vy * (dt / 16);

          if (node.baseX < 0) node.baseX = width;
          if (node.baseX > width) node.baseX = 0;
          if (node.baseY < 0) node.baseY = height;
          if (node.baseY > height) node.baseY = 0;
        }

        const swayX = Math.sin(node.phase) * 14 + mouseX * 20;
        const swayY = Math.cos(node.phase * 0.8) * 12 + mouseY * 15;
        const x = node.baseX + swayX;
        const y = node.baseY + swayY;

        currentNodes.push({ x, y, r: node.radius });

        // Draw node
        ctx.beginPath();
        ctx.arc(x, y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${particleColor}0.4)`;
        ctx.fill();
      }

      // Draw faint interconnecting constellations between close nodes
      const maxDistance = 140;
      for (let i = 0; i < currentNodes.length; i++) {
        for (let j = i + 1; j < currentNodes.length; j++) {
          const dx = currentNodes[i].x - currentNodes[j].x;
          const dy = currentNodes[i].y - currentNodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * (isDark ? 0.12 : 0.08);
            ctx.beginPath();
            ctx.moveTo(currentNodes[i].x, currentNodes[i].y);
            ctx.lineTo(currentNodes[j].x, currentNodes[j].y);
            ctx.strokeStyle = `${lineColor}${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      if (!prefersReducedMotion) {
        animId = requestAnimationFrame(render);
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      if (interactive) {
        window.removeEventListener("pointermove", handlePointerMove);
      }
      observer.disconnect();
    };
  }, [interactive]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
    />
  );
};

export default AmbientCanvas;
