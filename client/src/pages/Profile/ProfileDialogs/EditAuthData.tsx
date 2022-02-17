import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'
import React, { useState } from 'react'
import '../Profile.sass'

interface EdtiAuthDataProps {
  handleClose: () => void
  mode: 'email' | 'password' | null
}

export const EditAuthData: React.FC<EdtiAuthDataProps> = ({ mode, handleClose }) => {
  let isOpen = Boolean(mode)
  const [stage, setStage] = useState<'start' | 'success'>('start')

  const authHandler = () => {
    setStage('success')
  }

  const closeHandler = () => {
    handleClose()
    setTimeout(() => setStage('start'), 100)
  }

  const StartStage = () => {
    return (
      <>
        <DialogTitle className="text-warning lead">Вы уверены что хотите изменить E-mail?</DialogTitle>
        <DialogContent>
          <DialogContentText className="lead">
            Для изменения, введите E-mail и пароль. Вам на почту будет отправлено письмо с кодом подтвержденя.
          </DialogContentText>

          <div className="input-gruop">
            <TextField error={false} size="small" label="E-mail" />
            <TextField error={false} size="small" label="Пароль" />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeHandler}>Отменить</Button>
          <Button onClick={authHandler}>Отправить письмо</Button>
        </DialogActions>
      </>
    )
  }

  const SuccessStage = () => {
    return (
      <>
        <DialogTitle className="lead">Изменение E-mail</DialogTitle>
        <DialogContent>
          <DialogContentText className="lead">
            Введите код подтверждения, который был отправлен вам на почту
          </DialogContentText>

          <div className="input-gruop">
            <TextField error={false} label="Код подтверждения" inputProps={{ maxLength: 10 }} />
            <TextField error={false} size="small" label="Новый E-mail" inputProps={{ maxLength: 6 }} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeHandler}>Отменить</Button>
          <Button>Сохранить</Button>
        </DialogActions>
      </>
    )
  }

  return (
    <div>
      <Dialog open={isOpen} onClose={handleClose}>
        {stage === 'start' && <StartStage />}
        {stage === 'success' && <SuccessStage />}
      </Dialog>
    </div>
  )
}
