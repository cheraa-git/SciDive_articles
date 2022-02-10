import React, { useEffect, useState } from 'react'
import { Button, Dialog, DialogActions, DialogTitle, MenuItem, TextField, Tooltip } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { SpinLoader } from '../../components/UI/Loader/SpinLoader'
import { STATIC } from '../../config'
import {
  createArticle,
  deleteArticle,
  editArticle,
  fetchArticle,
  setSendArticle,
} from '../../store/actions/ArticleActions'
import { RootState } from '../../store/rootReducer'
import { CreateArticleData } from '../../types/interfaces'
import './CreateArticle.sass'

export const CreateArticle: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { enqueueSnackbar: snackbar } = useSnackbar()
  const { categoryList, loading, sendArticle } = useSelector((state: RootState) => state.article)
  const [sendAvatar, setSendAvatar] = useState<File>()
  const [dialogOpen, setDialogOpen] = useState(false)

  if (categoryList[0] === 'Все категории') {
    categoryList.shift()
  }

  const urlParams: any = {}
  decodeURI(window.location.search.substring(1))
    .split('&')
    .forEach((element) => {
      urlParams[element.split('=')[0]] = element.split('=')[1]
    })
  const editId = Number(urlParams.editArticleId)

  useEffect(() => {
    if (editId) {
      dispatch(fetchArticle(editId, true))
    }
  }, [dispatch, editId])

  const submitHandler = () => {
    if (localStorage.getItem('token') && sendArticle.title && sendArticle.content && sendArticle.category) {
      const payload: CreateArticleData = {
        token: localStorage.getItem('token'),
        title: sendArticle.title,
        sendAvatar,
        prevContent: sendArticle.prev_content,
        content: sendArticle.content,
        category: sendArticle.category,
        tags: '',
      }
      if (editId) {
        payload.id = editId
        dispatch(editArticle(payload, navigate))
      } else {
        dispatch(createArticle(payload, navigate))
      }
      console.log('submitHandler', payload)
    } else {
      snackbar('Заполните все обязательные поля', { variant: 'warning' })
    }
  }

  const deleteHandler = () => {
    dispatch(deleteArticle(sendArticle.id, navigate, snackbar))
  }

  const avatarHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      console.log(e.target.files[0])
      setArticle({ image: URL.createObjectURL(e.target.files[0]!) })
      setSendAvatar(e.target.files[0])
    }
  }

  const setArticle = (params: object) => {
    dispatch(setSendArticle({ ...sendArticle, ...params }))
  }

  const Avatar = () => {
    let path = ''
    if (sendArticle.image?.indexOf('http') === -1) {
      if (sendArticle.image) {
        path = STATIC + sendArticle.image
      }
    } else {
      path = sendArticle?.image + ''
    }
    return <img className="img-fluid rounded mb-3" src={path} alt="" />
  }

  const htmlContent = (
    <>
      <div className="card-body">
        <div className="d-flex mb-3">
          <TextField
            value={sendArticle.title}
            onChange={(e) => setArticle({ title: e.target.value })}
            variant="filled"
            label="Название *"
            size="small"
            fullWidth
            inputProps={{ maxLength: 70 }}
          />
          <Tooltip title={'Заголовок статьи, не более 70 символов. (обязательное поле)'} placement="right">
            <i className="bi bi-info-circle my-auto ms-2"></i>
          </Tooltip>
        </div>

        <div className="d-flex mb-3">
          <TextField
            value={sendArticle.category}
            onChange={(e) => setArticle({ category: e.target.value })}
            variant="filled"
            select
            fullWidth
            label="Категория *"
          >
            {categoryList.map((el, index) => (
              <MenuItem key={index} value={el}>
                {el}
              </MenuItem>
            ))}
          </TextField>
          <Tooltip title={'Обязательное поле'} placement="right">
            <i className="bi bi-info-circle my-auto ms-2"></i>
          </Tooltip>
        </div>

        <div className="d-flex mb-3">
          <TextField
            value={sendArticle.prev_content}
            onChange={(e) => setArticle({ prev_content: e.target.value })}
            variant="filled"
            label="Краткое описание"
            size="small"
            fullWidth
            multiline
            inputProps={{ maxLength: 150 }}
            rows={3}
          />
          <Tooltip
            title={'Если оставить пустым, будут взяты первые 150 символов из статьи. Не более 150 знаков.'}
            placement="right"
          >
            <i className="bi bi-info-circle my-auto ms-2"></i>
          </Tooltip>
        </div>

        <div className="d-flex mb-3">
          <p className="lead my-auto me-2">Аватарка:</p>
          <TextField variant="filled" type="file" onChange={avatarHandler} />
          <i className="bi bi-info-circle opacity-25 my-auto ms-2"></i>
        </div>
        <Avatar />

        <div className="d-flex mb-3">
          <TextField
            value={sendArticle.content}
            onChange={(e) => setArticle({ content: e.target.value })}
            variant="filled"
            label="Содержание *"
            size="small"
            fullWidth
            multiline
            rows={7}
          />
          <Tooltip title={'Обязательное поле'} placement="right">
            <i className="bi bi-info-circle my-auto ms-2"></i>
          </Tooltip>
        </div>
        <div className="text-end">
          <Button variant="contained" onClick={submitHandler}>
            {editId ? 'Сохранить изменения' : 'Создать'}
          </Button>
        </div>
      </div>
    </>
  )

  return (
    <div className="create-article card mx-auto" style={{ width: '65%', minWidth: '21rem' }}>
      <div className="card-header">
        <h1 className="display-5">{editId ? 'Редактирование' : 'Создание'} статьи</h1>
        {editId ? (
          <div className="text-end">
            <Button color="error" onClick={() => setDialogOpen(true)}>
              Удалить статью
            </Button>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
              <DialogTitle id="alert-dialog-title">Вы уверены, что хотите безвозвратно удалить статью?</DialogTitle>
              <DialogActions>
                <Button onClick={() => setDialogOpen(false)}>Отмена</Button>
                <Button onClick={deleteHandler} color="error">
                  Удалить
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        ) : null}
      </div>
      {loading ? <SpinLoader /> : htmlContent}
    </div>
  )
}
