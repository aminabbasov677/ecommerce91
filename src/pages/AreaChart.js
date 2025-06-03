import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const AreaChart = () => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    // Fetch session data from localStorage
    const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    // Generate data for the last 7 days
    const today = new Date();
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
      const session = sessions.find((s) => s.date === date) || {
        date,
        view: 0,
        cart: 0,
        checkout: 0,
      };
      const avg = (session.view + session.cart + session.checkout).toFixed(2);
      data.push({ date, avg: parseFloat(avg) });
    }

    const ctx = canvasRef.current.getContext('2d');

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map((d) => d.date),
        datasets: [
          {
            label: 'Average Session Time',
            data: data.map((d) => d.avg),
            fill: true,
            backgroundColor: 'rgba(0, 255, 195, 0.5)',
            borderColor: '#00ffc3',
            tension: 0.4, // Matches D3's curveCatmullRom
            pointRadius: 0, // No points, like D3
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            ticks: {
              color: '#00d1ff',
              font: { family: "'Orbitron', sans-serif", size: 12 },
            },
            grid: { display: false },
          },
          y: {
            beginAtZero: true,
            max: Math.max(...data.map((d) => d.avg), 100) * 1.2, // Ensure non-zero max
            ticks: {
              color: '#00d1ff',
              font: { family: "'Orbitron', sans-serif", size: 12 },
            },
            grid: { color: 'rgba(0, 209, 255, 0.2)' },
          },
        },
        animation: {
          duration: 2000,
          easing: 'easeInOutCubic',
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="chart-wrapper">
      <canvas ref={canvasRef} className="chart-3d" />
    </div>
  );
};

export default AreaChart;
