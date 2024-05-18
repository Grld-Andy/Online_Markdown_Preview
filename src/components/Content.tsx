import React, { useEffect, useState } from 'react'

interface Props {
  currentNote: { notes: string } | null
  content: string
  setContent: React.Dispatch<React.SetStateAction<string>>
}

const Content: React.FC<Props> = ({ currentNote, content, setContent }) => {
  const [showPreview, setShowPreview] = useState<boolean>(false)
  const [preview, setPreview] = useState<string>('')

  const changeView = () => {
    setShowPreview(!showPreview)
  }

  useEffect(() => {
    if (currentNote) {
      setPreview('')
      setContent(currentNote.notes ? currentNote.notes : '')
    }
  }, [currentNote, setContent])

  useEffect(() => {
    updatePreview(content)
  }, [content])

  const handlePreviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    const textareaContent = e.target.value
    updatePreview(textareaContent)
  }

  const updatePreview = (textareaContent: string) => {
    if (!textareaContent) {
      setPreview('')
      return
    }
    let formattedContent = textareaContent.split(/\n/g)
    formattedContent = formattedContent.map((sentence) => {
      const startNum = sentence.split('.')[0]
      if (sentence.startsWith('# ')) {
        // header 1
        return `<h1>${sentence.slice(2)}</h1>`
      } else if (sentence.startsWith('## ')) {
        // header 2
        return `<h2 style="font-weight: 300">${sentence.slice(3)}</h2>`
      } else if (sentence.startsWith('### ')) {
        // header 3
        return `<h3>${sentence.slice(4)}</h3>`
      } else if (sentence.startsWith('#### ')) {
        // header 4
        return `<h4>${sentence.slice(5)}</h4>`
      } else if (sentence.startsWith('##### ')) {
        // header 5
        return `<h5>${sentence.slice(6)}</h5>`
      } else if (sentence.startsWith('###### ')) {
        // header 6
        return `<h5 style="color: orangered">${sentence.slice(7)}</h5>`
      } else if (sentence.startsWith('> ')) {
        // blockquote
        return `<blockquote class="blockquote">${sentence.slice(2)}</blockquote>`
      } else if (sentence.startsWith('``` ') && sentence.endsWith(' ```')) {
        // code
        return `<blockquote class="code">${sentence.slice(4, sentence.length - 4)}</blockquote>`
      } else if (sentence.startsWith('- ')) {
        // unordered list
        return `<ul><li style="margin-left: 37px">${sentence.slice(2)}</li></ul>`
      } else if (!isNaN(Number(startNum)) && sentence.slice(startNum.length, startNum.length + 2) === '. ') {
        // ordered list
        return `<p style="margin-left: 20px">${sentence}</p>`
      } else {
        return `${sentence}<br>`
      }
    })
    const joinedContent = formattedContent.join('')
    setPreview(joinedContent)
  }

  return (
    <div className={showPreview ? 'preview-only' : ''}>
      <main>
        <div className="col1">
          <section className="row1">
            <p>MARKDOWN</p>
            <img src="/public/icon-show-preview.svg" alt="" onClick={changeView} />
          </section>
          <textarea id="textarea" onChange={handlePreviewChange} value={content}></textarea>
        </div>
        <div className="col2">
          <section className="row2">
            <p>PREVIEW</p>
            <img src={showPreview ? '/icon-hide-preview.svg' : '/icon-show-preview.svg'} alt="" onClick={changeView} />
          </section>
          <div id="preview" dangerouslySetInnerHTML={{ __html: preview }}></div>
        </div>
      </main>
    </div>
  )
}

export default Content
