import React from 'react'
import image from '../asserts/logotip.png'

export const Profile: React.FC = () => {
  const userName = 'AlexanderChernetsov'
  return (
    <div className="card m-2 p-0">
      <div className="card-header">
        <img className="rounded-circle mb-3" src={image} alt="Аватар"></img>
        <h1 className="fs-6">{userName}</h1>

      </div>
      <div className="card-body">
        <a href="#" className="btn btn-primary">Редактировать</a>
      </div>
    </div>
  )
}
