import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import React, { useState } from 'react'
import { STATIC } from '../../config'
import './Profile.sass'

interface editProfileProps {
  isOpen: boolean
  handleClose: () => void
}

export const EditProfileDialog: React.FC<editProfileProps> = ({ isOpen, handleClose }) => {
  const [userName, setUserName] = useState(localStorage.getItem('userName'))
  const [sendAvatar, setSendAvatar] = useState<File>()
  const [showAvatar, setShowAvatar] = useState(STATIC + localStorage.getItem('userAvatar'))

  const saveHandler = () => {}
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
    <div className="">
      <Dialog open={isOpen} maxWidth="xs" fullWidth>
        <DialogTitle>
          Редактирование профиля
          <i className="bi bi-x-lg edit-icon-close" onClick={closeHandler} />
        </DialogTitle>
        <DialogContent>
          <div className="container-sm">
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
