import React from 'react'
import { Col, Row,Card } from 'antd';

export default function ScoreCard({ icon, title, dateString, score, units }) {
  return (
    <Card style={{ borderColor: "#0199a7", maxWidth: "450px", borderRadius: "10px" }}>
      <Row>
        <Col span={12}>
          <img width={50} height={50} src={`/images/ivizz/${icon}.png`} />
        </Col>
        <Col  span={12} style={{lineHeight: '80%'}}>
          {dateString ? <h4 style={{color: '#0199A7'}}>{dateString}</h4> : ""}
          <h6 style={{color: '#0199A7'}}>{title}</h6>
          <br />
          <h3 style={{color: '#0199A7'}}>{score} {units}</h3>
        </Col>
      </Row>
    </Card>
  )
}
