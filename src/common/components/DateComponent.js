import React from 'react'
import { DatePicker } from 'antd';
import moment from 'moment'

export default function DateComponent({ onChange,date }) {
  const dateFormat = 'DD/MM/YYYY';
  return (
    <div>
      <DatePicker
        defaultValue={moment(new Date, dateFormat)}
        format={dateFormat}
        onChange={onChange}
        allowClear={false}
        size='large'
        value={moment(date, dateFormat)}
      />
    </div>
  )
}
