import React, { useEffect, useRef } from 'react';

const Fireworks: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const particles: Particle[] = [];
        const colors = ['#FFD700', '#FF0000', '#00FF00', '#00FFFF', '#FF00FF'];

        class Particle {
            x: number;
            y: number;
            color: string;
            velocity: { x: number; y: number };
            alpha: number;
            decay: number;

            constructor(x: number, y: number, color: string) {
                this.x = x;
                this.y = y;
                this.color = color;
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 3 + 1;
                this.velocity = {
                    x: Math.cos(angle) * speed,
                    y: Math.sin(angle) * speed
                };
                this.alpha = 1;
                this.decay = Math.random() * 0.015 + 0.005;
            }

            draw() {
                if(!ctx) return;
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            update() {
                this.x += this.velocity.x;
                this.y += this.velocity.y;
                this.velocity.y += 0.05; // Gravity
                this.alpha -= this.decay;
            }
        }

        const createFirework = () => {
            const x = Math.random() * width;
            const y = Math.random() * (height / 2);
            const color = colors[Math.floor(Math.random() * colors.length)];
            for (let i = 0; i < 30; i++) {
                particles.push(new Particle(x, y, color));
            }
        };

        const animate = () => {
            requestAnimationFrame(animate);
            ctx.fillStyle = 'rgba(15, 23, 42, 0.2)'; // Trail effect
            ctx.fillRect(0, 0, width, height);

            particles.forEach((particle, index) => {
                particle.update();
                particle.draw();
                if (particle.alpha <= 0) {
                    particles.splice(index, 1);
                }
            });

            if (Math.random() < 0.05) {
                createFirework();
            }
        };

        animate();

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />;
};

export default Fireworks;