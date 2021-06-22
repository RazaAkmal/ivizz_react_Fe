import { Link, Redirect } from "react-router-dom";
import configs from "../../services/configs";

const MenuCard = ({ title, link, cardIcon }) => {
  let marginTop = (title==="Mask Detect" || title==="Clean Detect") ? "50px" : 0
  return (
   <Link to={link}>
      <div className="card">
        <div style={{minWidth:240}}>
          <center  style={{marginTop: '20%'}}><img src={configs.baseURL + cardIcon}  height={50} /></center>
          
          <center style={{marginTop: "10px"}}>{title}</center>
          </div>
      </div>
    </Link>
  )
}

export default MenuCard