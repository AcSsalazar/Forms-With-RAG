import { Link } from 'react-router-dom';
import '../stylesheets/notfound.css';

import image404 from '../img/404-1.png';

function NotFound() {
  return (
    <section className="not-found">
      <div className="not-found-container">
        
        <div className="circle-bg"></div>

        <h1 className="not-found-404">
          4
          <span>
            <img src={image404} alt="0" className='icon-web'/>
          </span>
          4
        </h1>

        <div className="not-found-text">
          <h2>Ups!</h2>

          <p className='disclaimer'>
            Esta pagina no existe o no esta disponible
          </p>

          <div className="not-found-links">
            <Link to="/" className="btn-home">
              Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NotFound;