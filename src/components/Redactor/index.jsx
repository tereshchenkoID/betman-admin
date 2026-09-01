import { useRef } from 'react'
import { Editor } from '@tinymce/tinymce-react'

import { useTheme } from 'context/ThemeContext'

import style from './index.module.scss'

const Redactor = ({
  data,
  action,
  height = 300
}) => {
  const editorRef = useRef(null)
  const { theme } = useTheme()

  return (
    <div className={style.block}>
      <Editor
        key={theme}
        apiKey='hvvtnnsiqp3mdkg1r06vy2yxyebr9usp0fv6wboajjtfgyao'
        onInit={(_evt, editor) => editorRef.current = editor}
        value={data}
        onEditorChange={action}
        init={{
          height: height,
          menubar: false,
          skin: 'tinymce-5',
          content_style: `
            body {
              color: ${theme === 'light' ? '#2a121c' : '#f2f2f2'};
              line-height: 1.2;
            }
          `,
          plugins: [
            'image',
            'link',
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar:
            'undo redo | blocks | link underline bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | image',

          automatic_uploads: true,
          file_picker_types: 'image',
          paste_data_images: true,
          images_file_types: 'jpg,jpeg,png,webp,gif',
        }}
      />
    </div>
  )
}

export default Redactor
