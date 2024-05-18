import React, { useEffect, useState } from "react"

interface Note {
  id: number
  title: string
}

interface Props {
  handleSetSidebar: () => void
  showSidebar: boolean
  handleDelete: (id: number) => void
  currentNote: Note | null
  handleSave: (title: string) => void
}

const Navbar: React.FC<Props> = ({ handleSetSidebar, showSidebar, handleDelete, currentNote, handleSave }) => {
  const [filename, setFilename] = useState(currentNote ? currentNote.title : 'untitled.md')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (currentNote) {
      setFilename(currentNote.title)
    }
  }, [currentNote])

  const handleFilenameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilename(e.target.value)
  }

  const handleShowModal = () => {
    setShowModal(!showModal)
  }

  const deleteModal = () => {
    setShowModal(!showModal)
    if (currentNote) {
      handleDelete(currentNote.id)
    }
  }

  return (
    <div>
      <nav>
        <div className="left">
          <button onClick={handleSetSidebar}>
            {showSidebar
              ? <img src="/icon-close.svg" alt="" />
              : <img src="/icon-menu.svg" alt="" />}
          </button>
          <h1>MARKDOWN</h1>
          {currentNote &&
            <div className="document_name">
              <div className="line"></div>
              <img src="/icon-document.svg" alt="" />
              <div className="d_name">
                <p>Document Name</p>
                <input type='text' value={filename || 'untitled.md'} onChange={handleFilenameChange} />
              </div>
            </div>}
        </div>
        {currentNote &&
          <div className="right">
            <img src="/icon-delete.svg" alt="" className="svg-delete" onClick={handleShowModal} />
            <button onClick={() => handleSave(filename)}>
              <img src="/icon-save.svg" alt="" className="svg-save" />
              <p>Save Changes</p>
            </button>
          </div>}
      </nav>
      {showModal &&
        <div className="overflow" onClick={handleShowModal}>
          <div className="modal">
            <h1>Delete this document?</h1>
            <p>
              Are you sure you want to delete {filename} and its contents?
                        </p>
            <p>
              This action cannot be reversed
                        </p>
            <button onClick={deleteModal}>
              Confirm & Delete
                        </button>
          </div>
        </div>}
    </div>
  )
}

export default Navbar
