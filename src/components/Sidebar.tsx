import React from 'react'

interface Note {
  created_at: string
  title: string
}

interface Props {
  handleSetTheme: () => void
  notes: Note[] | null
  createNew: (title: string) => void
  handleCurrentNote: (index: number) => void
}

const Sidebar: React.FC<Props> = ({ handleSetTheme, notes, createNew, handleCurrentNote }) => {
  // generate title for a new note, default title is untitled_1 and increments by 1
  const generateTitle = (notes: Note[] | null) => {
    let maxIndex = 0
    if (notes) {
      notes.forEach((note) => {
        const titleMatch = note.title.match(/Untitled_(\d+)\.md/)
        if (titleMatch) {
          const index = parseInt(titleMatch[1])
          if (index > maxIndex) {
            maxIndex = index
          }
        }
      })
    }
    const newIndex = maxIndex + 1
    return `Untitled_${newIndex}.md`
  }

  // handle new note creation when user clicks + New Document button
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const title = generateTitle(notes)
    createNew(title)
  }

  // format date to display in the sidebar list
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const formattedDate = date.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })
    return formattedDate
  }

  // render sidebar with list of notes and new note creation form
  return (
    <div className="sidebar">
      <div className="upper">
        <h1>MARKDOWN</h1>
        <h2>MY DOCUMENTS</h2>
        <form onSubmit={handleSubmit}>
          <button type="submit">
            <p>+ New Document</p>
          </button>
        </form>
        {/* display list of all create notes */}
        {notes &&
          notes.map((note, index) => {
            return (
              <li key={index} onClick={() => handleCurrentNote(index)}>
                <img src="/icon-document.svg" alt="Document Icon" />
                <div className="list-data">
                  <p>{formatDate(note.created_at)}</p>
                  <p>{note.title}</p>
                </div>
              </li>
            )
          })}
      </div>
      {/* button for changing theme */}
      <div className="lower">
        <img src="/icon-dark-mode.svg" alt="Dark Mode Icon" className="moon" />
        <div className="toggle-button" onClick={handleSetTheme}>
          <div className="circle"></div>
        </div>
        <img src="/icon-light-mode.svg" alt="Light Mode Icon" className="sun" />
      </div>
    </div>
  )
}

export default Sidebar
