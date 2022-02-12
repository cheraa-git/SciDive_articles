import React from 'react'
import { Editor } from '@tinymce/tinymce-react'

interface ContentEditonProps {
  setState: (value: string) => void
}

export const ContentEditor: React.FC<ContentEditonProps> = ({ setState }) => {
  const handleEditorChange = (e: any) => {
    setState(e.target.getContent())
    console.log('Content was updated:', e.target.getContent())
  }
  return (
    <>
      <Editor
        apiKey="ni51cpobo4hmhf0n91j5vjva4c7903zur4lmvljalmlqetf9"
        initialValue="<p>Initial content</p>"
        init={{
          height: 550,
          toolbar1:
            'undo redo | fontsizeselect | fontselect | alignleft aligncenter alignright alignjustify | outdent indent | lineheight | bold italic  | h1 h2 h3 h4 h5 h6 | forecolor backcolory | ',
        }}
        onChange={handleEditorChange}
      />
    </>
  )
}
