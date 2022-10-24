import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSendArticle } from '../../store/actions/ArticleActions'
import { RootState } from '../../store/rootReducer'
import './CreateArticle.sass'

interface EditTagsAreaProps {}

export const EditTagsArea: React.FC = () => {
  const { sendArticle } = useSelector((state: RootState) => state.article)
  const tags = sendArticle.tags
  const dispatch = useDispatch()

  const removeTag = (i: number) => {
    const newTags = tags?.slice()
    newTags?.splice(i, 1)
    dispatch(setSendArticle({ ...sendArticle, tags: newTags }))
  }

  const tagsContent = () => {
    if (tags) {
      console.log(tags[0])
      return tags.map((tag, i) => {
        return (
          <div key={i}>
            <p># {tag}</p>
            <i className="bi bi-x" onClick={() => removeTag(i)} />
          </div>
        )
      })

    }
    return ''
  }

  return <div className="tags-area">{tagsContent()}</div>
}
