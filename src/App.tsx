import './App.css'
import { useState, useEffect } from 'react'
import Content from './components/Content'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import supabase from './config/supabaseClient'

interface Note {
  id: number
  title: string
  notes: string
  created_at: string
}

function App() {
  const [showSidebar, setShowSideBar] = useState<boolean>(false)
  const [content, setContent] = useState<string>('')
  const [theme, setTheme] = useState<string>(
    localStorage.getItem('md-theme') ? localStorage.getItem('md-theme')! : 'light'
  )
  const [notes, setNotes] = useState<Note[] | null>(null)
  const [currentNote, setCurrentNote] = useState<Note | null>(null)
  const [fetchError, setFetchError] = useState<string>('')

  const handleFetchError = (error: number) => {
    switch (error) {
      case 1:
        setFetchError('Failed to create')
        break
      case 2:
        setFetchError('Failed to fetch')
        break
      case 3:
        setFetchError('Failed to update')
        break
      case 4:
        setFetchError('Failed to delete')
        break
      default:
        setFetchError('')
    }
    setTimeout(() => {
      setFetchError('')
    }, 2000)
  }

  const handleSave = async (updateTitle: string) => {
    const { data, error } = await supabase
      .from('notes')
      .update({
        title: updateTitle,
        notes: content,
      })
      .eq('id', currentNote!.id)
    if (!error) {
      await fetchNotes()
      console.log(data)
    } else {
      handleFetchError(3)
    }
  }

  const fetchNotes = async () => {
    const { data, error } = await supabase.from('notes').select()
    if (error) {
      setNotes(null)
      handleFetchError(2)
    }
    if (data) {
      setNotes(data)
    }
  }

  const createNew = async (title: string) => {
    const { data, error } = await supabase.from('notes').insert({
      title: title,
    })
    if (!error) {
      await fetchNotes()
      setCurrentNote(notes![notes!.length - 1])
      console.log(data)
    } else {
      handleFetchError(1)
    }
  }

  const handleDelete = async (id: number) => {
    const { data, error } = await supabase.from('notes').delete().eq('id', id)
    if (!error) {
      await fetchNotes()
      setCurrentNote(null)
      setContent('')
      console.log(data)
    } else {
      handleFetchError(4)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  const handleSetSidebar = () => {
    setShowSideBar(!showSidebar)
  }

  const handleCurrentNote = (id: number) => {
    setCurrentNote(notes![id])
  }

  const handleSetTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
      localStorage.setItem('md-theme', 'dark')
    } else {
      setTheme('light')
      localStorage.setItem('md-theme', 'light')
    }
  }

  return (
    <div className={showSidebar ? `main ${theme}` : `${theme}`}>
      {showSidebar && (
        <Sidebar
          handleSetTheme={handleSetTheme}
          notes={notes}
          createNew={createNew}
          handleCurrentNote={handleCurrentNote}
        />
      )}
      <div>
        <Navbar
          handleSetSidebar={handleSetSidebar}
          showSidebar={showSidebar}
          currentNote={currentNote}
          handleDelete={handleDelete}
          handleSave={handleSave}
        />
        <Content currentNote={currentNote} content={content} setContent={setContent} />
      </div>
      {fetchError && (
        <div className="error">
          <p>{fetchError}</p>
        </div>
      )}
    </div>
  )
}

export default App
