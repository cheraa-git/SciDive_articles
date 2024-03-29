import React, { useEffect, useRef, useState } from 'react'
import { Button, Dialog, DialogActions, DialogTitle, IconButton, MenuItem, TextField, Tooltip } from '@mui/material'
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
import { ContentEditor } from '../../components/UI/ContentEditor'
import { InputDataList } from '../../components/InputDataList'
import { EditTagsArea } from './EditTagsArea'

export const CreateArticle: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { enqueueSnackbar: snackbar } = useSnackbar()
  const { categoryList, loading, sendArticle } = useSelector((state: RootState) => state.article)
  const [sendAvatar, setSendAvatar] = useState<File>()
  const [dialogOpen, setDialogOpen] = useState(false)
  let tagList = ['JavaScript', 'React', 'Hooks', 'Bootstrap']

  const tagsInpRef = useRef<HTMLInputElement>(null)

  if (categoryList[0] === 'Все категории') {
    categoryList.shift()
  }

  const urlParams: any = {}
  decodeURI(window.location.search.substring(1))
    .split('&')
    .forEach(element => {
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
        tags: sendArticle.tags || [],
      }
      if (editId) {
        payload.id = editId
        if (!payload.sendAvatar) {
          payload.sendAvatar = 'old'
        }
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
    // if
  }

  const avatarHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      console.log(e.target.files[0])
      setArticle({ image: URL.createObjectURL(e.target.files[0]!) })
      setSendAvatar(e.target.files[0])
    }
  }

  const tagsHandler = (event?: React.KeyboardEvent<HTMLDivElement>) => {
    if (!event || event?.code === 'Enter') {
      const input = tagsInpRef.current
      if (input && input.value) {
        if (sendArticle.tags) {
          if (sendArticle.tags.indexOf(input.value) >= 0) {
            snackbar('Такое ключевое слово уже добавлено')
            return
          }
          setArticle({ tags: [...sendArticle.tags, input.value] })
        } else {
          setArticle({ tags: [input.value] })
        }
        input.value = ''
      }
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

  const htmlContent = () => (
    <>
      <div className="input-container">
        <div>
          <TextField
            value={sendArticle.title}
            onChange={e => setArticle({ title: e.target.value })}
            variant="standard"
            label="Название *"
            size="small"
            inputProps={{ maxLength: 70 }}
          />
          <Tooltip title={'Заголовок статьи, не более 70 символов. (обязательное поле)'} placement="right">
            <i className="bi bi-info-circle my-auto ms-2"></i>
          </Tooltip>
        </div>

        <div>
          <TextField
            value={sendArticle.category}
            onChange={e => setArticle({ category: e.target.value })}
            variant="standard"
            select
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

        <div>
          <InputDataList
            inputRef={tagsInpRef}
            width="30vw"
            data={tagList}
            label="Ключевые слова"
            id="create-article-inp-data-list"
            onKeyDown={e => tagsHandler(e)}
          />

          <IconButton className="text-dark ms-1 mt-3" onClick={() => tagsHandler()} size="small">
            <i className="bi bi-plus-lg text-primary"></i>
          </IconButton>

          <Tooltip title={'Добавьте ключевые слова, для удобного поиска вашей статьи'} placement="right">
            <i className="bi bi-info-circle my-auto ms-2"></i>
          </Tooltip>
        </div>
        <EditTagsArea />

        <div>
          <TextField
            value={sendArticle.prev_content}
            onChange={e => setArticle({ prev_content: e.target.value })}
            // variant="filled"
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

        <div>
          <p className="lead my-auto me-2">Аватарка:</p>
          <TextField variant="standard" type="file" onChange={avatarHandler} />
          <i className="bi bi-info-circle opacity-25 my-auto ms-2"></i>
        </div>
        <Avatar />

        <div>
          <p className="lead fs-3 mb-1">Содержание:</p>
          <Tooltip title={'Обязательное поле'} placement="right">
            <i className="bi bi-info-circle my-auto ms-2"></i>
          </Tooltip>
        </div>

        <ContentEditor value={sendArticle.content} setValue={value => setArticle({ content: value })} />

        <div>
          <Button variant="contained" onClick={submitHandler}>
            {editId ? 'Сохранить изменения' : 'Создать'}
          </Button>
        </div>
      </div>
    </>
  )

  return (
    <div className="create-article card mx-auto bg-translucent-light" style={{ width: '65%', minWidth: '21rem' }}>
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
      {loading ? <SpinLoader /> : htmlContent()}
    </div>
  )
}
