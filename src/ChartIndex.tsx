import { type DateTime } from 'luxon'
import { Line } from 'react-chartjs-2';

export type Series = {
  label: string,
  data: { x: DateTime, y: number }[] 
}

const options = {
  responsive: false,
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
        tooltipFormat: 'yyyy MMMM'
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
    tooltip: {
      
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

  const data = {
    datasets: props.datasets.map((set, i) => ({
      ...set,
      borderColor: colors[i]
    })),
  }

  return (
    <>
      <Line data={data} options={options} width={800} height={800} />
    </>
  )
}