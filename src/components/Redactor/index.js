import React, { useRef } from 'react'
import { Editor } from '@tinymce/tinymce-react'

import style from './index.module.scss'

const Redactor = ({ data, action }) => {
  const editorRef = useRef(null)

  return (
    <div className={style.block}>
      <Editor
        apiKey='jxjoq6sfxuinuz0hlwh6j0dnekusf2shb0fcnt6jyaydzabn'
        onInit={(_evt, editor) => editorRef.current = editor}
        value={data}
        onEditorChange={action}
        init={{
          height: 300,
          menubar: false,
          skin: 'tinymce-5',
          content_style: `
            body { color: white; }
          `,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar:
            'undo redo | blocks | bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent',
        }}
      />
    </div>
  )
}

export default Redactor
