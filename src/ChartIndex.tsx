import { type DateTime } from 'luxon'
import { Line } from 'react-chartjs-2';

export type Series = {
  label: string,
  data: { x: DateTime, y: number }[] 
}

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      type: 'time' as const,
      time: {
        // Luxon format string
        // tooltipFormat: 'DD T',
        unit: 'day' as const,
        displayFormats: {
          day: 'yyyy MMM'
        },
      },
      title: {
        display: true,
        text: 'Date'
      },
    }
  },
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Bar Chart',
    },
  },
  locale: 'sv-SE' as const
}

export function ChartIndex (props: {
  datasets: Series[]
}) {

  const data = {
    datasets: props.datasets,
  }

  return (
    <>
      <Line data={data} options={options} />
    </>
  )
}