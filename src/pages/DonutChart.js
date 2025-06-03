import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const DonutChart = () => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const data = [
      { label: 'View', value: 300 },
      { label: 'Cart', value: 120 },
      { label: 'Checkout', value: 60 },
    ];

    const ctx = canvasRef.current.getContext('2d');

    // Destroy existing chart if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Create new Chart.js chart
    chartRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.map((d) => d.label),
        datasets: [
          {
            data: data.map((d) => d.value),
            backgroundColor: ['#00ffc3', '#ff00ff', '#00d1ff'],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#00d1ff',
              font: { family: 'Orbitron, sans-serif' },
            },
          },
        },
        cutout: '60%', // Mimics D3 innerRadius
        animation: {
          duration: 2000,
          easing: 'easeInOutCubic',
          animateRotate: true,
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

export default DonutChart;
