import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const AreaChart = () => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const data = [
      { date: '2025-05-23', avg: 300 },
      { date: '2025-05-24', avg: 320 },
      { date: '2025-05-25', avg: 280 },
      { date: '2025-05-26', avg: 350 },
      { date: '2025-05-27', avg: 310 },
      { date: '2025-05-28', avg: 330 },
      { date: '2025-05-29', avg: 340 },
    ];

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
            tension: 0.4, 
            pointBackgroundColor: '#00d1ff',
            pointBorderColor: '#00d1ff',
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
            grid: { display: false },
            ticks: {
              color: '#00d1ff',
              font: { family: 'Orbitron, sans-serif' },
            },
          },
          y: {
            beginAtZero: true,
            max: Math.max(...data.map((d) => d.avg)) * 1.2,
            grid: { color: 'rgba(0, 209, 255, 0.2)' },
            ticks: {
              color: '#00d1ff',
              font: { family: 'Orbitron, sans-serif' },
            },
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
      <canvas ref={canvasRef} className="chart" width={500} height={400}></canvas>
    </div>
  );
};

export default AreaChart;
