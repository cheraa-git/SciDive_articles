import React, { useState } from 'react'
import './CreateArticle.sass'
import { Tooltip, MenuItem, TextField, Button } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/rootReducer'
import { CreateArticleData } from '../../types/interfaces'
import { useNavigate } from 'react-router-dom'
import { createArticle } from '../../store/actions/ArticleActions'

export const CreateArticle: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { categoryList, currentCategory } = useSelector((state: RootState) => state.article)

  const [showAvatar, setShowAvatar] = useState('')
  const [sendAvatar, setSendAvatar] = useState<File>()
  const [category, setCategory] = useState(currentCategory)
  const [title, setTitle] = useState('')
  const [prevContent, setPrevContent] = useState('')
  const [content, setContent] = useState('')

  const inputHandler = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    func: React.Dispatch<React.SetStateAction<string>>
  ) => {
    func(event.target.value)
  }

  const submitHandler = () => {
    if (localStorage.getItem('token') && title  && content && category) {
      const payload: CreateArticleData = {
        token: localStorage.getItem('token'),
        title,
        sendAvatar,
        prevContent,
        content,
        category,
        tags: '',
      }
      console.log("submitHandler",payload)
      dispatch(createArticle(payload, navigate))

    } else {
      alert('Заполните все обязательные поля')
    }
  }

  const avatarHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setShowAvatar(URL.createObjectURL(e.target.files[0]!))
      setSendAvatar(e.target.files[0])
    }
  }
  return (
    <div className="create-article card mx-auto" style={{ width: '65%', minWidth: '21rem' }}>
      <div className="card-header">
        <h1 className="display-5">Создание статьи</h1>
      </div>

      <div className="card-body">
        <div className="d-flex mb-3">
          <TextField
            value={title}
            onChange={(e) => inputHandler(e, setTitle)}
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
            value={category}
            onChange={(e) => inputHandler(e, setCategory)}
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
            value={prevContent}
            onChange={(e) => inputHandler(e, setPrevContent)}
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
        {showAvatar && <img className="img-fluid rounded mb-3" src={showAvatar} alt="" />}

        <div className="d-flex mb-3">
          <TextField
            value={content}
            onChange={(e) => inputHandler(e, setContent)}
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
            Создать
          </Button>
        </div>
      </div>
    </div>
  )
}
