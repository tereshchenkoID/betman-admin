import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Editor } from '@tinymce/tinymce-react'

import 'tinymce/tinymce'
import 'tinymce/icons/default'
import 'tinymce/themes/silver'
import 'tinymce/models/dom'

import 'tinymce/skins/ui/tinymce-5/skin.min.css'
import 'tinymce/skins/ui/tinymce-5/content.min.css'
import 'tinymce/skins/content/default/content.min.css'

import './langs/uk.js'
import './langs/ru.js'
import './langs/fr_FR.js'
import './langs/es.js'
import './langs/pt_PT.js'
import './langs/de.js'

import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/code'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/media'
import 'tinymce/plugins/table'
import 'tinymce/plugins/help'
import 'tinymce/plugins/wordcount'

import { useTheme } from 'context/ThemeContext'

const TINYMCE_LANG_MAP = {
  en: undefined,
  uk: 'uk',
  fr: 'fr_FR',
  ru: 'ru',
  es: 'es',
  pt: 'pt_PT',
  de: 'de',
}

import style from './index.module.scss'

const Redactor = ({
  data,
  action,
  height = 300
}) => {
  const editorRef = useRef(null)
  const { theme } = useTheme()
  const { i18n } = useTranslation()

  const tinymceLanguage = TINYMCE_LANG_MAP[i18n.language]

  return (
    <div className={style.block}>
      <Editor
        key={`${theme}-${i18n.language}`}
        licenseKey='gpl'
        onInit={(_evt, editor) => editorRef.current = editor}
        value={data}
        onEditorChange={action}
        init={{
          height: height,
          menubar: false,
          skin: false,
          ...(tinymceLanguage && { language: tinymceLanguage }),
          content_css: false,
          content_style: `
            @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700&family=Roboto:wght@400;700&display=swap&subset=cyrillic');

            :root {
              --font-family: 'Roboto', sans-serif;
              --font-family-alt: 'Barlow Condensed', sans-serif;
            }
          
            h1, h2, h3, h4, h5, h6 {
              font-family: var(--font-family-alt);
              font-weight: 400;
            }
            
            body {
              font-family: var(--font-family);
              color: ${theme === 'light' ? '#2a121c' : '#f2f2f2'};
              line-height: 1.5;
            }
            
            * {
              margin-block: 0;
            }
            
            strong {
              font-weight: 700;
            }
          `,
          plugins: [
            'image',
            'link',
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'wordcount'
          ],
          toolbar:
            'undo redo | blocks | link underline bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | image',
          help_tabs: ['shortcuts', 'plugins', 'versions'],
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
