import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const DonutChart = () => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    // Fetch session data for today
    const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    const today = new Date().toISOString().split('T')[0];
    const session = sessions.find((s) => s.date === today) || {
      view: 0,
      cart: 0,
      checkout: 0,
    };
    const data = [
      { label: 'View', value: session.view || 0 },
      { label: 'Cart', value: session.cart || 0 },
      { label: 'Checkout', value: session.checkout || 0 },
    ];

    const ctx = canvasRef.current.getContext('2d');

    if (chartRef.current) {
      chartRef.current.destroy();
    }

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
          legend: { display: false },
          tooltip: {
            bodyFont: { family: "'Orbitron', sans-serif" },
          },
        },
        cutout: '60%', // Matches D3's innerRadius
        animation: {
          animateRotate: true,
          duration: 2000,
          easing: 'easeInOutCubic',
        },
        plugins: [{
          id: 'customLabels',
          afterDraw: (chart) => {
            const { ctx, chartArea } = chart;
            const centerX = (chartArea.left + chartArea.right) / 2;
            const centerY = (chartArea.top + chartArea.bottom) / 2;
            const radius = Math.min(chartArea.right - chartArea.left, chartArea.bottom - chartArea.top) / 2;
            const innerRadius = radius * 0.6;
            const labelRadius = (radius + innerRadius) / 2;

            chart.data.labels.forEach((label, i) => {
              const meta = chart.getDatasetMeta(0);
              const arc = meta.data[i];
              if (!arc) return; // Skip if arc is undefined (zero value)
              const { startAngle, endAngle } = arc;
              const midAngle = (startAngle + endAngle) / 2;
              const x = centerX + Math.cos(midAngle) * labelRadius;
              const y = centerY + Math.sin(midAngle) * labelRadius;

              ctx.save();
              ctx.fillStyle = '#00d1ff';
              ctx.font = "12px 'Orbitron', sans-serif";
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(label, x, y);
              ctx.restore();
            });
          },
        }],
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

export default DonutChart;
