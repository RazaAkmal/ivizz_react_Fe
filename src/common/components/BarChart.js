import React from 'react'
import { Bar } from 'react-chartjs-2'

const BarChart = (props) => {

  return (
    <Bar data={props.data || []} getElementAtEvent={props.handleChartClick} options={props.options} />
  )
}

export default BarChart