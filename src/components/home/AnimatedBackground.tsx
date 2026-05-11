"use client";

import { useEffect, useRef } from "react";

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Cellular Automata Configuration
    const cellSize = 20; // Size of each cell in pixels
    let cols = 0;
    let rows = 0;
    let grid: number[][] = [];
    let nextGrid: number[][] = [];

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.ceil(canvas.width / cellSize);
      rows = Math.ceil(canvas.height / cellSize);

      // Initialize grids
      grid = createGrid();
      nextGrid = createGrid();

      // Seed with random pattern
      seedGrid();
    };

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    function createGrid(): number[][] {
      const newGrid: number[][] = [];
      for (let i = 0; i < cols; i++) {
        newGrid[i] = [];
        for (let j = 0; j < rows; j++) {
          newGrid[i][j] = 0;
        }
      }
      return newGrid;
    }

    function seedGrid() {
      // Create interesting initial patterns
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          // Random sparse seeding (10% chance)
          if (Math.random() < 0.1) {
            grid[i][j] = 1;
          }
        }
      }

      // Add some glider patterns for movement
      addGlider(Math.floor(cols * 0.2), Math.floor(rows * 0.2));
      addGlider(Math.floor(cols * 0.8), Math.floor(rows * 0.3));
      addGlider(Math.floor(cols * 0.5), Math.floor(rows * 0.7));
    }

    function addGlider(x: number, y: number) {
      const pattern = [
        [0, 1, 0],
        [0, 0, 1],
        [1, 1, 1],
      ];

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const col = (x + i) % cols;
          const row = (y + j) % rows;
          if (col >= 0 && col < cols && row >= 0 && row < rows) {
            grid[col][row] = pattern[i][j];
          }
        }
      }
    }

    function countNeighbors(x: number, y: number): number {
      let count = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue;

          const col = (x + i + cols) % cols;
          const row = (y + j + rows) % rows;
          count += grid[col][row];
        }
      }
      return count;
    }

    function updateGrid() {
      // Apply Conway's Game of Life rules with modification
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const neighbors = countNeighbors(i, j);
          const currentState = grid[i][j];

          if (currentState === 1) {
            // Cell survival rules (standard: 2-3)
            nextGrid[i][j] = neighbors === 2 || neighbors === 3 ? 1 : 0;
          } else {
            // Cell birth rules (standard: 3)
            nextGrid[i][j] = neighbors === 3 ? 1 : 0;
          }
        }
      }

      // Swap grids
      [grid, nextGrid] = [nextGrid, grid];
    }

    // Mouse interaction
    let mouseX = -1;
    let mouseY = -1;
    let isMouseDown = false;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = Math.floor(e.clientX / cellSize);
      mouseY = Math.floor(e.clientY / cellSize);

      if (isMouseDown && mouseX >= 0 && mouseX < cols && mouseY >= 0 && mouseY < rows) {
        // Draw cells around mouse
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const col = (mouseX + i + cols) % cols;
            const row = (mouseY + j + rows) % rows;
            if (col >= 0 && col < cols && row >= 0 && row < rows) {
              grid[col][row] = 1;
            }
          }
        }
      }
    };

    const handleMouseDown = () => {
      isMouseDown = true;
    };

    const handleMouseUp = () => {
      isMouseDown = false;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);

    // Animation loop
    let animationFrameId: number;
    let lastUpdate = 0;
    const updateInterval = 100; // Update every 100ms
    let time = 0;

    const animate = (timestamp: number) => {
      time += 0.01;

      // Update cellular automata at fixed intervals
      if (timestamp - lastUpdate > updateInterval) {
        updateGrid();
        lastUpdate = timestamp;

        // Occasionally add new life to prevent extinction
        if (Math.random() < 0.05) {
          const x = Math.floor(Math.random() * cols);
          const y = Math.floor(Math.random() * rows);
          addGlider(x, y);
        }
      }

      // Check theme
      const isDark = document.documentElement.classList.contains("dark");

      // Clear canvas with fade effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw cells with gradient colors
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          if (grid[i][j] === 1) {
            const x = i * cellSize;
            const y = j * cellSize;

            // Color based on position and time for dynamic effect
            const hue = isDark
              ? (i * 2 + j * 2 + time * 50) % 360 // Cyan to purple range for dark
              : (180 + i * 2 + j * 2 + time * 50) % 360; // Blue to teal for light

            const saturation = isDark ? 80 : 70;
            const lightness = isDark ? 60 : 50;

            // Create gradient for each cell
            const gradient = ctx.createRadialGradient(
              x + cellSize / 2,
              y + cellSize / 2,
              0,
              x + cellSize / 2,
              y + cellSize / 2,
              cellSize / 2
            );

            gradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness}%, 0.8)`);
            gradient.addColorStop(1, `hsla(${hue}, ${saturation}%, ${lightness}%, 0.2)`);

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize / 2 - 1, 0, Math.PI * 2);
            ctx.fill();

            // Add glow effect
            ctx.shadowBlur = 10;
            ctx.shadowColor = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.5)`;
          }
        }
      }

      // Reset shadow
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 -z-10" style={{ opacity: 0.3 }} />;
}
