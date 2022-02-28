import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { STATIC } from '../../../config'
import { editProfile } from '../../../store/actions/UserActions'
import '../Profile.sass'
import { EditAuthData } from './EditAuthData'

interface editProfileProps {
  isOpen: boolean
  handleClose: () => void
}

export const EditProfileDialog: React.FC<editProfileProps> = ({ isOpen, handleClose }) => {
  const dispatch = useDispatch()
  const [userName, setUserName] = useState(localStorage.getItem('userName'))
  const [sendAvatar, setSendAvatar] = useState<File>()
  const [showAvatar, setShowAvatar] = useState(STATIC + localStorage.getItem('userAvatar'))

  const [authMode, setAuthMode] = useState<'password' | 'email' | 'delete' | null>(null)

  const saveHandler = () => {
    const sendData: any = {} // написать интерфейс 
    if (userName !== localStorage.getItem('userName')){
      // sendData.oldLogin = localStorage.getItem('userName')
      sendData.newLogin = userName
    }
    if (sendAvatar) {
      sendData.image = sendAvatar
    }
    
    console.log('sendData', sendData)
    
    dispatch(editProfile(sendData))
  }
  const closeHandler = () => {
    setUserName(localStorage.getItem('userName'))
    handleClose()
  }

  const avatarHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      console.log(e.target.files[0])
      setShowAvatar(URL.createObjectURL(e.target.files[0]!))
      setSendAvatar(e.target.files[0])
    }
  }

  return (
    <div>
      <Dialog open={isOpen} maxWidth="xs" fullScreen>
        <DialogTitle>
          Редактирование профиля
          <i className="bi bi-x-lg edit-icon-close" onClick={closeHandler} />
        </DialogTitle>
        <DialogContent>
          <div className="edit-container">
            <p className="lead m-0">Никнейм</p>
            <TextField
              className="mb-3"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value)
              }}
              size="small"
              variant="filled"
              fullWidth
            />

            <p className="lead m-0">Аватарка</p>
            <TextField onChange={avatarHandler} size="small" variant="filled" fullWidth type="file" />

            <img className="edit-avatar" src={showAvatar} alt="Аватар" />

            <Divider className="my-3" />

            <div className="text-center">
              <Button onClick={() => setAuthMode('email')}>Изменить E-mail</Button>
              <Button onClick={() => setAuthMode('password')}>Изменить Пароль</Button>
              <br />
              <Button onClick={() => setAuthMode('delete')} color="error">Удалить аккаунт</Button>
              <EditAuthData mode={authMode} handleClose={() => setAuthMode(null)} />
            </div>
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeHandler} color="inherit">
            Отмена
          </Button>
          <Button onClick={saveHandler}>Сохранить</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
