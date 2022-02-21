import React from 'react'
import { Editor } from '@tinymce/tinymce-react'

interface ContentEditonProps {
  setValue: (value: string) => void
  value: string
}

export const ContentEditor: React.FC<ContentEditonProps> = ({ setValue, value }) => {
  const handleEditorChange = (e: any) => {
    setValue(e)
  }
  return (
    <>
      <Editor
        apiKey="ni51cpobo4hmhf0n91j5vjva4c7903zur4lmvljalmlqetf9"
        value={value}
        init={{
          height: 550,
          toolbar:
            'undo redo | fontsizeselect | alignleft aligncenter alignright alignjustify | outdent indent | lineheight | bold italic underline | forecolor backcolory | ',
        }}
        onEditorChange={(value) => setValue(value)}
      />
    </>
  )
}
