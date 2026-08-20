import { useState, useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const windowSize = 60;

const getDefaultPoints = () => ({
  variance: [{ x: 0, y: [0, 0] }],
  payloadLength: [],
  entropy: [],
  packetAvg: [],
  srate: [],
  drate: [],
  flowActiveTime: [],
});

const updateArray = (arr, val) => {
  const updated = [];
  for (let i = 0; i < arr.length; i++) {
    updated.push(arr[i]);
  }
  updated.push(val);
  if (updated.length > windowSize) {
    updated.shift();
  }
  return updated;
};

const Graph = ({ type, metrics, second }) => {
  const prevSecond = useRef(null);
  const [globalTimestamp, setGlobalTimestamp] = useState(0);
  const [points, setPoints] = useState(getDefaultPoints());

  useEffect(() => {
    if (!metrics || second == null || second === prevSecond.current) return;

    let increment;
    if (second > prevSecond.current) {
      increment = second - prevSecond.current;
    } else {
      increment = (60 - prevSecond.current) + second;
    }
    prevSecond.current = second;

    setGlobalTimestamp((previous) => {
      const newGlobal = previous + increment;
      
      setPoints((prevPoints) => {
        const newPoints = {};
        for (const key in prevPoints) {
          newPoints[key] = prevPoints[key];
        }
        
        if (type === 'variance') {
          newPoints.variance = updateArray(prevPoints.variance, { x: newGlobal, y: [metrics.packetmin, metrics.packetmax] });
          newPoints.payloadLength = updateArray(prevPoints.payloadLength, { x: newGlobal, y: metrics.payloadLength });
          newPoints.entropy = updateArray(prevPoints.entropy, { x: newGlobal, y: metrics.payloadentropy });
          newPoints.packetAvg = updateArray(prevPoints.packetAvg, { x: newGlobal, y: metrics.packetavg });
        } else if (type === 'mixed') {
          newPoints.srate = updateArray(prevPoints.srate, { x: newGlobal, y: metrics.srate });
          newPoints.drate = updateArray(prevPoints.drate, { x: newGlobal, y: metrics.drate });
          newPoints.flowActiveTime = updateArray(prevPoints.flowActiveTime, { x: newGlobal, y: metrics.flowActiveTime });
        }
        return newPoints;
      });

      return newGlobal;
    });
  }, [second, metrics, type]);

  // Sliding x-axis range calculation
  const minTime = globalTimestamp < windowSize ? 0 : globalTimestamp - (windowSize - 1);
  const maxTime = globalTimestamp < windowSize ? windowSize - 1 : globalTimestamp;

  if (type === 'variance') {
    return (
      <Bar
        data={{
          datasets: [
            {
              type: 'bar',
              label: 'Variance (min-max)',
              data: points.variance,
              backgroundColor: 'rgba(100, 149, 237, 0.5)',
              borderSkipped: false,
            },
            {
              type: 'line',
              label: 'Payload Length',
              data: points.payloadLength,
              borderColor: 'blue',
              fill: false,
              pointRadius: 0,
              tension: 0.2,
              borderWidth: 1,
            },
            {
              type: 'line',
              label: 'Entropy',
              data: points.entropy,
              borderColor: 'Teal',
              fill: false,
              pointRadius: 0,
              tension: 0.3,
              borderWidth: 1,
            },
            {
              type: 'scatter',
              label: 'Packet Avg',
              data: points.packetAvg,
              borderColor: 'green',
              backgroundColor: 'green',
              showLine: false,
            },
          ],
        }}
        options={{
          animation: { duration: 0 },
          scales: {
            x: {
              type: 'linear',
              min: minTime,
              max: maxTime,
              offset: false,
              title: { display: true, text: 'Time (s)' },
              ticks: {
                callback: (value) => value % 60,
                maxTicksLimit: 10,
                autoSkip: true,
                font: { style: 'normal' },
              },
            },
            y: { beginAtZero: true },
          },
          responsive: true,
          maintainAspectRatio: false,
        }}
      />
    );
  }

  if (type === 'mixed') {
    return (
      <Bar
        data={{
          datasets: [
            {
              type: 'line',
              label: 'Source Rate',
              data: points.srate,
              borderColor: 'blue',
              fill: false,
              pointRadius: 0,
              tension: 0.3,
              borderWidth: 1,
            },
            {
              type: 'line',
              label: 'Destination Rate',
              data: points.drate,
              borderColor: 'Teal',
              fill: false,
              pointRadius: 0,
              borderWidth: 1,
            },
            {
              type: 'bar',
              label: 'Total Flow Active Time',
              data: points.flowActiveTime,
              backgroundColor: 'rgba(0, 128, 0, 0.5)',
              borderSkipped: false,
              barPercentage: 1.0,
              categoryPercentage: 1.0,
            },
          ],
        }}
        options={{
          animation: { duration: 0 },
          scales: {
            x: {
              type: 'linear',
              min: minTime,
              max: maxTime,
              offset: false,
              title: { display: true, text: 'Time (s)' },
              ticks: {
                callback: (value) => value % 60,
                maxTicksLimit: 10,
                autoSkip: true,
                font: { style: 'normal' },
              },
            },
            y: { beginAtZero: true },
          },
          responsive: true,
          maintainAspectRatio: false,
        }}
      />
    );
  }

  return null;
};

export default Graph;