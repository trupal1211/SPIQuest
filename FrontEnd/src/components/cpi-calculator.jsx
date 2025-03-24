import { useState, useEffect } from "react"
import { FaEdit, FaTrash } from "react-icons/fa"
import { showToast } from "./toast"

export default function CpiCalculator() {
  const [branches, setBranches] = useState([])
  const [selectedBranch, setSelectedBranch] = useState(null)
  const [semesterResults, setSemesterResults] = useState([])
  const [cpi, setCpi] = useState(null)
  const [showInputForm, setShowInputForm] = useState(false)
  const [currentSemester, setCurrentSemester] = useState(null)
  const [spiValue, setSpiValue] = useState("")
  const [editMode, setEditMode] = useState(false)
  const [editingResultId, setEditingResultId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [semesters, setSemesters] = useState([])

  // Fetch branches from API
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true)
        const response = await fetch("http://localhost:3000/branches")
        if (!response.ok) {
          throw new Error("Failed to fetch branches")
        }
        const data = await response.json()
        setBranches(data)
      } catch (error) {
        showToast(error.message, "error")
      } finally {
        setLoading(false)
      }
    }

    fetchBranches()
  }, [])

  // Handle branch selection
  const handleBranchChange = async (e) => {
    const branchId = Number.parseInt(e.target.value)
    if (!branchId) {
      setSelectedBranch(null)
      setSemesters([])
      return
    }

    try {
      setLoading(true)
      // Fetch semester data for the selected branch
      const response = await fetch(`http://localhost:3000/branch/${branchId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch semester data")
      }

      const semesterData = await response.json()
      setSemesters(semesterData)

      // Find the branch object
      const selectedBranchObj = branches.find((branch) => branch.branchId === branchId)
      setSelectedBranch(selectedBranchObj)
    } catch (error) {
      showToast(error.message, "error")
    } finally {
      setLoading(false)
    }

    setSemesterResults([])
    setCpi(null)
    setShowInputForm(false)
    setCurrentSemester(null)
    setSpiValue("")
    setEditMode(false)
    setEditingResultId(null)
  }

  // Get available semesters (not already added)
  const getAvailableSemesters = () => {
    if (!semesters.length) return []

    return semesters.filter((semester) => {
      const isAdded = semesterResults.some((result) => result.semNo === semester.semester)
      return !isAdded || (editMode && currentSemester && semester.semester === currentSemester.semester)
    })
  }

  // Handle semester selection
  const handleSemesterChange = (e) => {
    const semId = Number.parseInt(e.target.value)
    const semester = semesters.find((s) => s.semesterDataId === semId) || null
    setCurrentSemester(semester)

    // If in edit mode, pre-fill the form with existing data
    if (editMode && editingResultId) {
      const resultToEdit = semesterResults.find((result) => result.id === editingResultId)
      if (resultToEdit && resultToEdit.semNo === semester?.semester) {
        setSpiValue(resultToEdit.spi)
      } else {
        setSpiValue("")
      }
    } else {
      setSpiValue("")
    }
  }

  // Add or update semester result
  const addOrUpdateSemesterResult = () => {
    if (!currentSemester) {
      showToast("Please select a semester", "warning")
      return
    }

    if (spiValue === "") {
      showToast("Please enter SPI value", "warning")
      return
    }

    const spi = Number.parseFloat(spiValue.toString())

    if (isNaN(spi) || spi < 0 || spi > 10) {
      showToast("SPI must be between 0 and 10", "error")
      return
    }

    // Check if semester already exists (for non-edit mode)
    if (!editMode) {
      const existingSemester = semesterResults.find((sr) => sr.semNo === currentSemester.semester)
      if (existingSemester) {
        showToast("Semester already added", "warning")
        return
      }
    }

    // Create new semester result
    const newSemesterResult = {
      id: editMode ? editingResultId : Date.now(),
      semNo: currentSemester.semester,
      semName: `Semester ${currentSemester.semester}`,
      credits: currentSemester.semesterCredit,
      spi: spi,
    }

    // Add to or update results
    let updatedResults
    if (editMode) {
      updatedResults = semesterResults.map((result) => (result.id === editingResultId ? newSemesterResult : result))
      showToast("Semester updated successfully", "success")
    } else {
      updatedResults = [...semesterResults, newSemesterResult]
      showToast("Semester added successfully", "success")
    }

    setSemesterResults(updatedResults)

    // Calculate CPI
    calculateCpi(updatedResults)

    // Reset form and edit mode
    setCurrentSemester(null)
    setSpiValue("")
    setShowInputForm(false)
    setEditMode(false)
    setEditingResultId(null)
  }

  // Edit a semester result
  const editSemesterResult = (id) => {
    const resultToEdit = semesterResults.find((result) => result.id === id)
    if (resultToEdit) {
      setEditMode(true)
      setEditingResultId(id)
      setShowInputForm(true)

      // Find and set the semester
      const semester = semesters.find((s) => s.semester === resultToEdit.semNo)
      setCurrentSemester(semester)

      // Set form values
      setSpiValue(resultToEdit.spi)
    }
  }

  // Delete a semester result
  const deleteSemesterResult = (id) => {
    if (confirm("Are you sure you want to delete this semester?")) {
      const updatedResults = semesterResults.filter((result) => result.id !== id)
      setSemesterResults(updatedResults)

      // Recalculate CPI
      if (updatedResults.length > 0) {
        calculateCpi(updatedResults)
      } else {
        setCpi(null)
      }

      showToast("Semester deleted successfully", "info")
    }
  }

  // Calculate CPI
  const calculateCpi = (results) => {
    let totalCreditPoints = 0
    let totalCredits = 0

    results.forEach((result) => {
      totalCreditPoints += result.spi * result.credits
      totalCredits += result.credits
    })

    const calculatedCpi = totalCredits > 0 ? totalCreditPoints / totalCredits : 0
    setCpi(calculatedCpi)
  }

  // Get CPI color class
  const getCpiColorClass = () => {
    if (!cpi) return ""

    if (cpi >= 8.5 && cpi <= 10) {
      return "green"
    } else if (cpi >= 7.5 && cpi < 8.49) {
      return "orange"
    } else if (cpi >= 6.5 && cpi < 7.49) {
      return "tomato"
    } else {
      return "red"
    }
  }

  return (
    <div className="cpi-calculator">
      <h2>Cumulative Performance Index (CPI) Calculator</h2>

      <div className="selection-container">
        <div className="selection-group">
          <label htmlFor="branch-cpi">Select Branch:</label>
          <select
            id="branch-cpi"
            value={selectedBranch?.branchId || ""}
            onChange={handleBranchChange}
            disabled={loading}
          >
            <option value="">-- Select Branch --</option>
            {branches.map((branch) => (
              <option key={branch.branchId} value={branch.branchId}>
                {branch.branchName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <div className="loading-spinner">Loading...</div>}

      {selectedBranch && !loading && (
        <>
          {!showInputForm ? (
            <div className="add-subject-container">
              <button className="add-course-button" onClick={() => setShowInputForm(true)}>
                + Add Semester Result
              </button>
            </div>
          ) : (
            <div className="input-card">
              <div className="selection-group">
                <label htmlFor="semester-select">{editMode ? "Edit Semester:" : "Select Semester:"}</label>
                <select
                  id="semester-select"
                  value={currentSemester?.semesterDataId || ""}
                  onChange={handleSemesterChange}
                  disabled={editMode}
                >
                  <option value="">-- Select Semester --</option>
                  {getAvailableSemesters().map((semester) => (
                    <option key={semester.semesterDataId} value={semester.semesterDataId}>
                      Semester {semester.semester} ({semester.semesterCredit} credits)
                    </option>
                  ))}
                </select>
              </div>

              {currentSemester && (
                <>
                  <div className="semester-info">
                    <p>
                      <strong>Semester Credits:</strong> {currentSemester.semesterCredit}
                    </p>
                  </div>

                  <div className="input-group compact">
                    <label htmlFor="spi-input">Enter SPI (0-10):</label>
                    <input
                      type="number"
                      id="spi-input"
                      value={spiValue}
                      onChange={(e) => setSpiValue(e.target.value)}
                      min="0"
                      max="10"
                      step="0.5"
                      className="small-input"
                    />
                  </div>

                  <div className="button-group">
                    <button className="calculate-button" onClick={addOrUpdateSemesterResult}>
                      {editMode ? "Update Semester" : "Add Semester"}
                    </button>
                    <button
                      className="cancel-button"
                      onClick={() => {
                        setShowInputForm(false)
                        setEditMode(false)
                        setEditingResultId(null)
                        setCurrentSemester(null)
                        setSpiValue("")
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {semesterResults.length > 0 && (
            <div className="results-container">
              <h3>Semester Results</h3>
              <div className="semesters-container">
                <div className="semester-header">
                  <div className="semester-name">Semester</div>
                  <div className="semester-credits">Credits</div>
                  <div className="semester-spi">SPI</div>
                  <div className="semester-actions">Actions</div>
                </div>

                {semesterResults.map((result) => (
                  <div className="semester-row" key={result.id}>
                    <div className="semester-name">{result.semName}</div>
                    <div className="semester-credits">{result.credits}</div>
                    <div className="semester-spi">{result.spi.toFixed(2)}</div>
                    <div className="semester-actions">
                      <button className="edit-button" onClick={() => editSemesterResult(result.id)} title="Edit">
                        <FaEdit />
                      </button>
                      <button className="delete-button" onClick={() => deleteSemesterResult(result.id)} title="Delete">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {cpi !== null && (
                <div className="cpi-result-container">
                  <h3>Your Cumulative Performance Index (CPI)</h3>
                  <div className={`cpi-value bolder ${getCpiColorClass()}`}>{cpi.toFixed(2)}</div>
                  <div className="grade-description">
                    {cpi >= 8.5
                      ? "Outstanding Performance!"
                      : cpi >= 7.5
                        ? "Excellent Performance!"
                        : cpi >= 6.5
                          ? "Very Good Performance!"
                          : cpi >= 5.5
                            ? "Good Performance!"
                            : cpi >= 4.5
                              ? "Average Performance"
                              : cpi >= 4.0
                                ? "Below Average"
                                : "Needs Improvement"}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

