import { ChartData, ChartOptions } from 'chart.js';
import { type DateTime } from 'luxon'
import { Line } from 'react-chartjs-2';

export type Series = {
  label: string
  shortname?: string
  data: { x: DateTime, y: number }[] 
}

const options: ChartOptions<'line'> = {
  responsive: false,
  maintainAspectRatio: false,
  scales: {
    x: {
      type: 'time' as const,
      time: {
        // Luxon format string
        // tooltipFormat: 'DD T',
        unit: 'month' as const,
        displayFormats: {
          day: 'yyyy MMM'
        },
        tooltipFormat: 'yyyy MMMM'
      },
      title: {
        display: true,
        text: 'Date'
      },
    },
    y: {
      suggestedMin: 0,
      position: 'right',
      // stacked: true,
      ticks: {
        callback: (value: any) => (100*value).toLocaleString() + '%'
      }
    },
    y2: {
      display: false,
    },
  },
  plugins: {
    legend: {
      labels: {
        filter: (item) => !item.text.includes('hide'),
      },
      position: 'top' as const,
    },
    title: {
      display: false,
      text: 'Title?',
    },
    tooltip: {
      callbacks: {
        label: (value) => {
          const baseLabel = value.dataset.label + ': '
          // TODO diffrentiate between axis
          if (value.parsed.y > 10) {
            return baseLabel + value.parsed.y.toLocaleString(undefined, {maximumFractionDigits: 1 })
          } 

          return baseLabel + (100*value.parsed.y).toLocaleString(undefined, { maximumFractionDigits: 1 }) + '%'
        }
      }
    }
  },
  locale: 'sv-SE' as const
}

export const colors = [
  '#00838F', '#C75050', '#283593', '#FFA866', '#00695C', '#9E9E4F', '#47898F',  
  '#3D302E', '#346962', '#4A5394', '#9e9e4f', '#ff9e54', '#c14848', '#3d302e'
];

export function ChartIndex (props: {
  datasets: Series[]
}) {

  const data: ChartData<"line"> = {
    datasets: props.datasets.map((set, i) => ({
      borderColor: colors[i],
      ...set,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointHitRadius: 15,
    })) as any[],
  }

  return (
    <Line
      data={data}
      options={options}
      width={window.innerWidth - 80}
      height={window.innerHeight - 200}
    />
  )
}