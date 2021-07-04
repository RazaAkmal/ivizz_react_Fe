import { useEffect,useState } from 'react'
import styles from '../style.css'
import { Link, Redirect } from "react-router-dom";
import { Row, Col } from 'antd';

const IvizzHeader = ({ logoUrl }) => {

  const [subdomain, setSubdomain] = useState('')
  const [site, setSite] = useState('')
  const [path, setPath] = useState('')

  useEffect(() => {
    const path = window.location.pathname
    setSubdomain(localStorage.getItem('subdomain'))
    setSite(localStorage.getItem('site'))
  })

  return (
    /* <div className="">
      {path === '' ?
        <Link to="/">
          <img className={styles.left} src='/assets/logo.png' alt="Ivizz Logo" width={120} height={120} />
        </Link>
        :
        <img className={styles.left} src='/assets/logo.png' alt="Ivizz Logo" width={120} height={120} />
      }
      {subdomain !== '' &&  
       <img className={styles.right} src={""} alt="Client Logo Alt" width={180} height={100} /> 
      }
    </div> */
    <Row justify="space-between" align="middle">
      <Col span={8}>
        <Link to="/">
          <img className={styles.left} src='/assets/logo.png' alt="Ivizz Logo" width={120} height={120} />
        </Link>
      </Col>
      {subdomain ? 
      <Col span={8} style={{ textAlign: "center" }}>
        <h2>{subdomain}</h2>
      </Col>
      : null }
      {/* <Col span={8} style={{ textAlign: "end" }}>
        <img className={styles.left} src='/assets/logo.png' alt="Ivizz Logo" width={120} height={120} />
      </Col> */}
    </Row>
  )
}

export default IvizzHeader