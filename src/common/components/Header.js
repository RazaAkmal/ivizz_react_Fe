import { useEffect,useState } from 'react'
import '../style.css'
import { Link, Redirect } from "react-router-dom";
import { Row, Col } from 'antd';
import configs from "../../services/configs";

const IvizzHeader = ({ logoUrl }) => {

  const [subdomain, setSubdomain] = useState('')
  const [logo, setLogo] = useState('')
  const [site, setSite] = useState('')
  const [path, setPath] = useState('')

  useEffect(() => {
    const path = window.location.pathname
    setSubdomain(localStorage.getItem('subdomain'))
    setLogo(localStorage.orgLogo)
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
          <img className="logo-image left" src='/assets/logo.png' alt="Ivizz Logo"/>
        </Link>
      </Col>
      {logo && logo !== "null" ?
        <Col span={8} style={{ textAlign: "end" }}>
          <div className="logo-image right">
            <img className="logo-image right" src={configs.baseURL + logo} alt="Ivizz Logo" style={{ width: '100%' }} />
            {subdomain && subdomain !== "null" ? 
              <span style={{ display: "flex", justifyContent: "center", lineHeight: "2rem", color: "#0199A7" }}>
              {subdomain.toUpperCase()}</span>
            : null }
          </div>
        </Col>
      : null }
    </Row>
  )
}

export default IvizzHeader