import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'
import React, { useState } from 'react'
import '../Profile.sass'

interface EdtiAuthDataProps {
  handleClose: () => void
  mode: 'email' | 'password' | 'delete' | null
}

type Stage = 'start' | 'success' | 'deleteStart' | 'deleteSuccess'

export const EditAuthData: React.FC<EdtiAuthDataProps> = ({ mode, handleClose }) => {
  let isOpen = Boolean(mode)
  const [stage, setStage] = useState<Stage>('start')

  const authHandler = () => {
    setStage('success')
  }

  const closeHandler = () => {
    handleClose()
    setTimeout(() => setStage('start'), 100)
  }

  const formatMode = () => {
    if (mode === 'email') {
      return 'E-mail'
    } else if (mode === 'password') {
      return 'пароль'
    } else {
      console.log('EditAuthData: mode is null')
      return ''
    }
  }

  const StartStage = () => {
    return (
      <>
        <DialogTitle className="text-warning lead">Вы уверены что хотите изменить {formatMode()}?</DialogTitle>
        <DialogContent>
          <DialogContentText className="lead">
            Для изменения, введите E-mail и пароль. Вам на почту будет отправлено письмо с кодом подтвержденя.
          </DialogContentText>

          <div className="input-gruop">
            <TextField size="small" label="E-mail" />
            <TextField size="small" label="Пароль" />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeHandler} color="inherit">
            Отменить
          </Button>
          <Button onClick={authHandler}>Отправить письмо</Button>
        </DialogActions>
      </>
    )
  }

  const SuccessStage = () => {
    return (
      <>
        <DialogTitle className="lead">Изменить {formatMode()}</DialogTitle>
        <DialogContent>
          <DialogContentText className="lead">
            Введите код подтверждения, который был отправлен вам на почту
          </DialogContentText>

          <div className="input-gruop">
            <TextField error={false} label="Код подтверждения" inputProps={{ maxLength: 10 }} />
            <TextField error={false} size="small" label={`Новый ${formatMode()}`} inputProps={{ maxLength: 6 }} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeHandler} color="inherit">
            Отменить
          </Button>
          <Button>Сохранить</Button>
        </DialogActions>
      </>
    )
  }

  const StartDeleteStage = () => {
    return (
      <>
        <DialogTitle className="lead text-danger">Вы уверены что хотите удалить аккаунт?</DialogTitle>
        <DialogContent>
          <DialogContentText className="lead">
            Восстановить данные аккаунта после удаления будет невозможно!
          </DialogContentText>

          <div className="input-gruop">
            <TextField size="small" label="E-mail" />
            <TextField size="small" label="Пароль" />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeHandler} color="inherit">
            Отменить
          </Button>
          <Button onClick={authHandler}>Отправить</Button>
        </DialogActions>
      </>
    )
  }
  const SuccessDeleteStage = () => {
    return (
      <>
        <DialogTitle className="lead text-danger">Удалить аккаунт</DialogTitle>
        <DialogContent>
          <DialogContentText className="lead">
            Введите код подтверждения, который был отправлен вам на почту
          </DialogContentText>

          <div className="input-gruop">
            <TextField error={false} label="Код подтверждения" inputProps={{ maxLength: 10 }} />
            <TextField error={false} size="small" label={`Новый ${formatMode()}`} inputProps={{ maxLength: 6 }} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeHandler} color="inherit">
            Отменить
          </Button>
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
