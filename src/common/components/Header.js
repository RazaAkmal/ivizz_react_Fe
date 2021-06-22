import { useEffect,useState } from 'react'
import styles from '../style.css'
import { Link, Redirect } from "react-router-dom";

const IvizzHeader = ({ logoUrl }) => {

  const [subdomain, setSubdomain] = useState('')
  const [site, setSite] = useState('')
  const [path, setPath] = useState('')
  useEffect(() => {
    const path = window.location.pathname
    if (path === '/guest' || path === "/parent") {
      setPath(path)
    }
    if (path !== '/login') {
      setSubdomain(localStorage.getItem('subdomain'))
     setSite(localStorage.getItem('site'))
    }
  })
  return (
    <div className="">
      {path === '' ?
        <Link to="/">
          <img className={styles.left} src='/assets/logo.png' alt="Ivizz Logo" width={120} height={120} />
        </Link>
        :
        <img className={styles.left} src='/assets/logo.png' alt="Ivizz Logo" width={120} height={120} />
      }
      {/* {subdomain !== '' &&  
       <img className={styles.right} src={configs[subdomain][site]['logo']} alt="Client Logo Alt" width={180} height={100} /> 
     } */} 
    </div>
  )
}

export default IvizzHeader