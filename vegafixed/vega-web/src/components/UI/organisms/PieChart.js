import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const protocolColors = {
  coap: '#e6194b',
  http: '#3cb44b',
  https: '#ffe119',
  dns: '#4363d8',
  telnet: '#f58231',
  ssh: '#911eb4',
  tcp: '#46f0f0',
  udp: '#f032e6',
  dhcp: '#bcf60c',
  arp: '#fabebe',
  icmp: '#008080',
  igmp: '#e6beff',
};

const PieChart = ({ protocols }) => {
  const [cumulative, setCumulative] = useState({});

  useEffect(() => {
    if (!protocols || typeof protocols !== 'object') return;

    setCumulative((prev) => {
      const updated = {};
      for (const key in prev) {
        updated[key] = prev[key];
      }
      for (const [key, val] of Object.entries(protocols)) {
        if (typeof val === 'number' && val >= 0) {
          updated[key] = (updated[key] || 0) + val;
        } else {
          updated[key] = updated[key] || 0;
        }
      }
      return updated;
    });
  }, [protocols]);

  const filtered = Object.entries(cumulative).filter(([_, value]) => value > 0);
  const hasData = filtered.length > 0;

  const protocolData = hasData ? filtered.map(([_, value]) => value) : [1];

  const labels = hasData
    ? filtered.map(([name, value]) => `${name.toUpperCase()} (${value})`)
    : ['No Input Data'];

  const backgroundColors = hasData
    ? filtered.map(([name]) => protocolColors[name] || '#000000')
    : ['#A9A9A9'];

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Pie
        data={{
          labels,
          datasets: [{
            data: protocolData,
            backgroundColor: backgroundColors,
          }],
        }}
        options={{
          animation: false,
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'right',
              labels: {
                font: { size: 14, weight: 'bold' },
                filter: (legendItem, chartData) =>
                  chartData.datasets[0].data[legendItem.index] > 0,
              },
            },
          },
        }}
        style={{ maxWidth: '100%', maxHeight: '100%' }}
      />
    </div>
  );
};

export default PieChart;