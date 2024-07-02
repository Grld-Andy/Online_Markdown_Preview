import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect'
import supabase from './config/supabaseClient'
import App from './App'

// Mock the Supabase client
const mockFrom = jest.fn().mockReturnThis()
const mockUpdate = jest.fn().mockReturnThis()
const mockEq = jest.fn().mockReturnThis()
const mockSelect = jest.fn().mockReturnThis()
const mockInsert = jest.fn().mockReturnThis()
const mockDelete = jest.fn().mockReturnThis()

supabase.from = mockFrom
mockFrom.mockImplementation(() => ({
  update: mockUpdate,
  eq: mockEq,
  select: mockSelect,
  insert: mockInsert,
  delete: mockDelete,
}))

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should handle save correctly', async () => {
    const mockData = { data: null, error: null }
    mockUpdate.mockResolvedValue(mockData)
    mockEq.mockReturnThis()

    render(<App />)

    // Simulate save action
    // Ensure there is a Save button and it is clicked
    const saveButton = screen.getByText('Save')
    userEvent.click(saveButton)

    // Assert fetchNotes and handleFetchError are called
    await waitFor(() => {
      expect(mockFrom).toHaveBeenCalledWith('notes')
      expect(mockUpdate).toHaveBeenCalledTimes(1)
      expect(mockUpdate).toHaveBeenCalledWith({
        title: expect.any(String),
        notes: expect.any(String),
      })
    })
  })
})
