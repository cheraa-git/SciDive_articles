import React, { useState } from 'react'

export const CreateArticle: React.FC = () => {
  const [image, setImage] = useState<File>()
  
  return (
    <div>
      <h1>Create Article</h1>
      <input type="file" onChange={(e: React.ChangeEvent<HTMLInputElement>) =>setImage(e.target.files![0])} />
      
    </div>
  )
}
