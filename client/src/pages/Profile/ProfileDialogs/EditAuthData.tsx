import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { authCheck, editProfile } from '../../../store/actions/UserActions'
import '../Profile.sass'

interface EdtiAuthDataProps {
  handleClose: () => void
  mode: 'email' | 'password' | 'delete' | null
}

type Stage = 'start' | 'success' | 'deleteStart' | 'deleteSuccess' | null

export const EditAuthData: React.FC<EdtiAuthDataProps> = ({ mode, handleClose }) => {
  const dispatch = useDispatch()
  const { enqueueSnackbar: snackbar } = useSnackbar()
  let isOpen = Boolean(mode)
  const [stage, setStage] = useState<Stage>('start')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newData, setNewData] = useState('')
  const [confirmCode, setConfirmCode] = useState('')

  useEffect(() => {
    if (mode === 'email' || mode === 'password') {
      setStage('start')
    } else if (mode === 'delete') {
      setStage('deleteStart')
    }
  }, [mode])

  const authHandler = async () => {
    if (email.match(/^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i) && password.length >= 6) {
      if (mode === 'email' || mode === 'password') {
        const isAuth = await dispatch(authCheck(email, password, 'edit'))
        console.log('IS_AUTH', String(isAuth))
        if (String(isAuth) === 'success') {
          snackbar('Успешно', { variant: 'success' })
          setStage('success')
        } else if (JSON.stringify(isAuth) === 'failed') {
          snackbar('Неверный логин или пароль')
        } else {
          console.log('ERROR', JSON.stringify(isAuth))
        }
      } else if (mode === 'delete') {
        setStage('deleteSuccess')
      }
    } else {
      snackbar('Данные некорректны')
    }
  }

  const saveHandler = () => {
    if (mode === 'email') {
      dispatch(editProfile({ oldEmail: email, newEmail: newData, forgotCode: confirmCode }))
    }
  }

  const closeHandler = () => {
    setEmail('')
    setPassword('')
    setNewData('')
    setConfirmCode('')
    handleClose()
    setTimeout(() => setStage('start'), 100)
  }

  const formatMode = () => {
    if (mode === 'email') {
      return 'E-mail'
    } else if (mode === 'password') {
      return 'пароль'
    } else {
      return ''
    }
  }

  const startStage = () => {
    return (
      <>
        <DialogTitle className="text-warning lead">Вы уверены что хотите изменить {formatMode()}?</DialogTitle>
        <DialogContent>
          <DialogContentText className="lead">
            Для изменения, введите E-mail и пароль. Вам на почту будет отправлено письмо с кодом подтвержденя.
          </DialogContentText>

          <div className="input-gruop">
            <TextField value={email} onChange={(e) => setEmail(e.target.value)} size="small" label="E-mail" />
            <TextField
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="new-password"
              size="small"
              label="Пароль"
            />
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

  const successStage = () => {
    return (
      <>
        <DialogTitle className="lead">Изменить {formatMode()}</DialogTitle>
        <DialogContent>
          <DialogContentText className="lead">
            Введите код подтверждения, который был отправлен вам на почту
          </DialogContentText>

          <div className="input-gruop">
            <TextField
              value={confirmCode}
              onChange={(e) => setConfirmCode(e.target.value)}
              label="Код подтверждения"
              inputProps={{ maxLength: 6 }}
            />

            <TextField
              value={mode === 'email' ? email : password}
              onChange={(e) => (mode === 'email' ? setEmail(e.target.value) : setPassword(e.target.value))}
              size="small"
              label={`Старый ${formatMode()}`}
            />
            <TextField
              value={newData}
              onChange={(e) => setNewData(e.target.value)}
              size="small"
              label={`Новый ${formatMode()}`}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeHandler} color="inherit">
            Отменить
          </Button>
          <Button onClick={saveHandler}>Сохранить</Button>
        </DialogActions>
      </>
    )
  }

  const startDeleteStage = () => {
    return (
      <>
        <DialogTitle className="lead text-danger">Вы уверены, что хотите удалить аккаунт?</DialogTitle>
        <DialogContent>
          <DialogContentText className="lead">
            Восстановить данные аккаунта после удаления будет невозможно!
          </DialogContentText>

          <div className="input-gruop">
            <TextField value={email} onChange={(e) => setEmail(e.target.value)} size="small" label="E-mail" />
            <TextField
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="new-password"
              size="small"
              label="Пароль"
            />
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
  const successDeleteStage = () => {
    return (
      <>
        <DialogTitle className="lead text-danger">Удалить аккаунт</DialogTitle>
        <DialogContent>
          <DialogContentText className="lead">
            Введите код подтверждения, который был отправлен вам на почту
          </DialogContentText>

          <div className="input-gruop">
            <TextField
              value={confirmCode}
              onChange={(e) => setConfirmCode(e.target.value)}
              label="Код подтверждения"
              inputProps={{ maxLength: 6 }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeHandler} color="inherit">
            Отменить
          </Button>
          <Button onClick={saveHandler} color="error">
            Удалить
          </Button>
        </DialogActions>
      </>
    )
  }

  const activeStage = () => {
    if (stage === 'start') {
      return startStage()
    } else if (stage === 'success') {
      return successStage()
    } else if (stage === 'deleteStart') {
      return startDeleteStage()
    } else if (stage === 'deleteSuccess') {
      return successDeleteStage()
    } else return ''
  }

  return (
    <div>
      <Dialog open={isOpen}>{activeStage()}</Dialog>
    </div>
  )
}
