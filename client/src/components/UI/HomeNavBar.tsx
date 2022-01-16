import React from "react"

export const HomeNavBar: React.FC = () => {
  return (
    <nav className="navbar navbar-expand navbar-light bg-light ">
  <div className="container">
    <div className="collapse navbar-collapse">
      <ul className="navbar-nav m-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <a className="nav-link active" aria-current="page" href="">Общая лента</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="">Мои подписки</a>
        </li>
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Категория
          </a>
          <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
            <li><a className="dropdown-item" >Программирование</a></li>
            <li><a className="dropdown-item">Администрирование</a></li>
            <li><a className="dropdown-item">Менеджмент</a></li>
            <li><a className="dropdown-item">Финансы</a></li>
          </ul>
        </li>
      </ul>
     
    </div>
  </div>
</nav>
  )
}