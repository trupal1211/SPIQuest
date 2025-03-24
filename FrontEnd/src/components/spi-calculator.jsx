import { useState, useEffect } from "react"
import { FaEdit, FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa"
import { showToast } from "./toast"

export default function SpiCalculator() {
  const [branches, setBranches] = useState([])
  const [selectedBranch, setSelectedBranch] = useState(null)
  const [selectedSemester, setSelectedSemester] = useState(null)
  const [subjects, setSubjects] = useState([])
  const [availableSubjects, setAvailableSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState(null)

  const [sessionalMarks, setSessionalMarks] = useState("")
  const [attendanceMarks, setAttendanceMarks] = useState("")
  const [termworkMarks, setTermworkMarks] = useState("")
  const [externalMarks, setExternalMarks] = useState("")

  const [courseResults, setCourseResults] = useState([])
  const [spi, setSpi] = useState(null)
  const [showInputCard, setShowInputCard] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editingResultId, setEditingResultId] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
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
        console.log(data)
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

    setSelectedSemester(null)
    setSubjects([])
    setAvailableSubjects([])
    setSelectedSubject(null)
    setCourseResults([])
    setSpi(null)
  }

  // Handle semester selection
  const handleSemesterChange = async (e) => {
    const semNo = Number.parseInt(e.target.value)
    if (!semNo) {
      setSelectedSemester(null)
      setSubjects([])
      setAvailableSubjects([])
      return
    }

    setSelectedSemester(semNo)

    if (selectedBranch) {
      try {
        setLoading(true)
        // Fetch subjects for the selected branch and semester
        const response = await fetch(`http://localhost:3000/branch/${selectedBranch.branchId}/semester/${semNo}`)

        if (!response.ok) {
          throw new Error("Failed to fetch subjects")
        }

        const subjectsData = await response.json()

        // Map API response to our expected format
        const formattedSubjects = subjectsData.map((subject) => ({
          subjectCode: subject.subjectCode,
          subjectName: subject.subjectName,
          subjectCredit: subject.subjectCredit,
          totalMarks: subject.totalMarks,
          total_sessionalMarks: subject.sessionalMark || 0,
          total_termworkMarks: subject.termWorkMark || 0,
          total_externamMarks: subject.externalMark || 0,
          attendance: subject.attendance || 0,
        }))

        setSubjects(formattedSubjects)
        setAvailableSubjects(formattedSubjects)
      } catch (error) {
        showToast(error.message, "error")
      } finally {
        setLoading(false)
      }
    }

    setSelectedSubject(null)
    setCourseResults([])
    setSpi(null)
  }

  // Update available subjects when courseResults change
  useEffect(() => {
    if (subjects.length > 0) {
      const addedSubjectCodes = courseResults.map((result) => result.subjectCode)
      const filteredSubjects = subjects.filter(
        (subject) =>
          !addedSubjectCodes.includes(subject.subjectCode) ||
          (editMode && selectedSubject && subject.subjectCode === selectedSubject.subjectCode),
      )
      setAvailableSubjects(filteredSubjects)
    }
  }, [courseResults, subjects, editMode, selectedSubject])

  // Handle subject selection
  const handleSubjectChange = (e) => {
    const subjectCode = e.target.value
    const subject = subjects.find((s) => s.subjectCode === subjectCode) || null
    setSelectedSubject(subject)

    // If in edit mode, pre-fill the form with existing data
    if (editMode && editingResultId) {
      const resultToEdit = courseResults.find((result) => result.id === editingResultId)
      if (resultToEdit && resultToEdit.subjectCode === subjectCode) {
        setSessionalMarks(resultToEdit.sessionalMarks)
        setAttendanceMarks(resultToEdit.attendanceMarks)
        setTermworkMarks(resultToEdit.termworkMarks)
        setExternalMarks(resultToEdit.externalMarks)
      } else {
        resetForm()
      }
    } else {
      resetForm()
    }
  }

  // Reset form fields
  const resetForm = () => {
    setSessionalMarks("")
    setAttendanceMarks("")
    setTermworkMarks("")
    setExternalMarks("")
  }

  // Calculate grade and points based on percentage
  const calculateGradeAndPoints = (
    percentage,
    sessionalMarks,
    termworkMarks,
    externalMarks,
    total_sessionalMarks,
    total_termworkMarks,
    total_externamMarks,
  ) => {
    let points = 0
    let grade = ""

    if (84.5 <= percentage && percentage <= 100) {
      points = 10.0
      grade = "AA"
    } else if (74.5 <= percentage && percentage <= 84.49) {
      points = 9.0
      grade = "AB"
    } else if (64.5 <= percentage && percentage <= 74.49) {
      points = 8.0
      grade = "BB"
    } else if (54.5 <= percentage && percentage <= 64.49) {
      points = 7.0
      grade = "BC"
    } else if (44.5 <= percentage && percentage <= 54.49) {
      points = 6.0
      grade = "CC"
    } else if (39.5 <= percentage && percentage <= 44.49) {
      points = 5.0
      grade = "CD"
    } else {
      points = 0
      grade = "FF"
    }

    // Check if external marks are less than 35%
    if (total_externamMarks > 0) {
      if ((externalMarks * 100) / total_externamMarks < 35) {
        points = 0
        grade = "FF"
      }
    }

    // Check if termwork marks are less than 35%
    if (total_termworkMarks > 0) {
      if ((termworkMarks * 100) / total_termworkMarks < 35) {
        points = 0
        grade = "FF"
      }
    }

    // Check if sessional marks are less than required
    if (total_sessionalMarks > 0) {
      if (sessionalMarks < 8) {
        points = 0
        grade = "FF"
      }
    }

    return { points, grade }
  }

  // Add or update subject result
  const addOrUpdateSubjectResult = () => {
    if (!selectedSubject) {
      showToast("Please select a subject", "warning")
      return
    }

    // Validate inputs based on what components are available
    if (selectedSubject.total_sessionalMarks > 0 && (sessionalMarks === "" || attendanceMarks === "")) {
      showToast("Please enter sessional and attendance marks", "warning")
      return
    }

    if (selectedSubject.total_termworkMarks > 0 && termworkMarks === "") {
      showToast("Please enter termwork marks", "warning")
      return
    }

    if (selectedSubject.total_externamMarks > 0 && externalMarks === "") {
      showToast("Please enter external marks", "warning")
      return
    }

    // Convert inputs to numbers
    const sessional = selectedSubject.total_sessionalMarks > 0 ? Number(sessionalMarks) : 0
    const attendance = selectedSubject.total_sessionalMarks > 0 ? Number(attendanceMarks) : 0
    const termwork = selectedSubject.total_termworkMarks > 0 ? Number(termworkMarks) : 0
    const external = selectedSubject.total_externamMarks > 0 ? Number(externalMarks) : 0

    // Validate marks
    if (selectedSubject.total_sessionalMarks > 0) {
      if (sessional > selectedSubject.total_sessionalMarks - 4) {
        // Assuming 4 is max for attendance
        showToast(`Sessional marks cannot exceed ${selectedSubject.total_sessionalMarks - 4}`, "error")
        return
      }

      if (attendance > 4) {
        showToast("Attendance marks cannot exceed 4", "error")
        return
      }
    }

    if (selectedSubject.total_termworkMarks > 0 && termwork > selectedSubject.total_termworkMarks) {
      showToast(`Termwork marks cannot exceed ${selectedSubject.total_termworkMarks}`, "error")
      return
    }

    if (selectedSubject.total_externamMarks > 0 && external > selectedSubject.total_externamMarks) {
      showToast(`External marks cannot exceed ${selectedSubject.total_externamMarks}`, "error")
      return
    }

    // Calculate total marks
    const totalObtained = sessional + attendance + termwork + external
    const totalPossible =
      selectedSubject.total_sessionalMarks + selectedSubject.total_termworkMarks + selectedSubject.total_externamMarks

    // Calculate percentage
    const percentage = (totalObtained * 100) / totalPossible

    // Calculate grade and points
    const { grade, points } = calculateGradeAndPoints(
      percentage,
      sessional,
      termwork,
      external,
      selectedSubject.total_sessionalMarks,
      selectedSubject.total_termworkMarks,
      selectedSubject.total_externamMarks,
    )

    // Check if subject already exists (for non-edit mode)
    if (!editMode) {
      const existingSubject = courseResults.find((cr) => cr.subjectCode === selectedSubject.subjectCode)
      if (existingSubject) {
        showToast("Subject already added", "warning")
        return
      }
    }

    // Create new course result
    const newCourseResult = {
      id: editMode ? editingResultId : Date.now(),
      subjectCode: selectedSubject.subjectCode,
      subjectName: selectedSubject.subjectName,
      credit: selectedSubject.subjectCredit,
      sessionalMarks: sessional,
      attendanceMarks: attendance,
      termworkMarks: termwork,
      externalMarks: external,
      total_sessionalMarks: selectedSubject.total_sessionalMarks,
      total_termworkMarks: selectedSubject.total_termworkMarks,
      total_externamMarks: selectedSubject.total_externamMarks,
      totalMarks: totalPossible,
      totalObtained: totalObtained,
      percentage: percentage,
      grade: grade,
      points: points,
    }

    // Add to or update results
    let updatedResults
    if (editMode) {
      updatedResults = courseResults.map((result) => (result.id === editingResultId ? newCourseResult : result))
      showToast("Subject updated successfully", "success")
    } else {
      updatedResults = [...courseResults, newCourseResult]
      showToast("Subject added successfully", "success")
    }

    setCourseResults(updatedResults)

    // Calculate SPI
    calculateSpi(updatedResults)

    // Reset form and edit mode
    setSelectedSubject(null)
    resetForm()
    setShowInputCard(false)
    setEditMode(false)
    setEditingResultId(null)
  }

  // Edit a subject result
  const editSubjectResult = (id) => {
    const resultToEdit = courseResults.find((result) => result.id === id)
    if (resultToEdit) {
      setEditMode(true)
      setEditingResultId(id)
      setShowInputCard(true)

      // Find and set the subject
      const subject = subjects.find((s) => s.subjectCode === resultToEdit.subjectCode)
      setSelectedSubject(subject)

      // Set form values
      setSessionalMarks(resultToEdit.sessionalMarks)
      setAttendanceMarks(resultToEdit.attendanceMarks)
      setTermworkMarks(resultToEdit.termworkMarks)
      setExternalMarks(resultToEdit.externalMarks)
    }
  }

  // Delete a subject result
  const deleteSubjectResult = (id) => {
    if (confirm("Are you sure you want to delete this subject?")) {
      const updatedResults = courseResults.filter((result) => result.id !== id)
      setCourseResults(updatedResults)

      // Recalculate SPI
      if (updatedResults.length > 0) {
        calculateSpi(updatedResults)
      } else {
        setSpi(null)
      }

      showToast("Subject deleted successfully", "info")
    }
  }

  // Calculate SPI
  const calculateSpi = (results) => {
    let totalCreditPoints = 0
    let totalCredits = 0

    results.forEach((result) => {
      totalCreditPoints += result.points * result.credit
      totalCredits += result.credit
    })

    const calculatedSpi = totalCredits > 0 ? totalCreditPoints / totalCredits : 0
    setSpi(calculatedSpi)
  }

  // Get SPI color class
  const getSpiColorClass = () => {
    if (!spi) return ""

    if (spi >= 8.5 && spi <= 10) {
      return "green"
    } else if (spi >= 7.5 && spi < 8.49) {
      return "orange"
    } else if (spi >= 6.5 && spi < 7.49) {
      return "tomato"
    } else {
      return "red"
    }
  }

  // Get grade color class
  const getGradeColorClass = (points) => {
    if (points === 10.0 || points === 9.0) {
      return "green"
    } else if (points === 8.0) {
      return "orange"
    } else if (points === 7.0) {
      return "tomato"
    } else {
      return "red"
    }
  }

  return (
    <div className="spi-calculator">
      <h2>Semester Performance Index (SPI) Calculator</h2>

      <div className="selection-container">
        <div className="selection-group">
          <label htmlFor="branch">Select Branch:</label>
          <select id="branch" value={selectedBranch?.branchId || ""} onChange={handleBranchChange} disabled={loading}>
            <option value="">-- Select Branch --</option>
            {branches.map((branch) => (
              <option key={branch.branchId} value={branch.branchId}>
                {branch.branchName}
              </option>
            ))}
          </select>
        </div>

        <div className="selection-group">
          <label htmlFor="semester">Select Semester:</label>
          <select
            id="semester"
            value={selectedSemester || ""}
            onChange={handleSemesterChange}
            disabled={!selectedBranch || loading}
          >
            <option value="">-- Select Semester --</option>
            {semesters.map((semester) => (
              <option key={semester.semesterDataId} value={semester.semester}>
                Semester {semester.semester}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <div className="loading-spinner">Loading...</div>}

      {selectedBranch && selectedSemester && !loading && (
        <>
          {!showInputCard ? (
            <div className="add-subject-container">
              <button className="add-course-button" onClick={() => setShowInputCard(true)}>
                + Add Subject
              </button>
            </div>
          ) : (
            <div className="input-card" id="input-card">
              <div className="selection-group">
                <label htmlFor="subject">{editMode ? "Edit Subject:" : "Select Subject:"}</label>
                <select
                  id="subject"
                  value={selectedSubject?.subjectCode || ""}
                  onChange={handleSubjectChange}
                  disabled={editMode}
                >
                  <option value="">-- Select Subject --</option>
                  {availableSubjects.map((subject) => (
                    <option key={subject.subjectCode} value={subject.subjectCode}>
                      {subject.subjectName} ({subject.subjectCode})
                    </option>
                  ))}
                </select>
              </div>

              {selectedSubject && (
                <>
                  <div className="subject-info">
                    <p>
                      <strong>Subject Credit:</strong> {selectedSubject.subjectCredit}
                    </p>
                    <p>
                      <strong>Total Marks:</strong> {selectedSubject.totalMarks}
                    </p>
                  </div>

                  <div className="marks-container">
                    {selectedSubject.total_sessionalMarks > 0 && (
                      <div className="marks-input-group" id="sessional_input_container">
                        <div className="input-row">
                          <div className="input-group compact">
                            <label htmlFor="internal">
                              Sessional Marks (Max {selectedSubject.total_sessionalMarks - 4}):
                            </label>
                            <input
                              type="number"
                              id="internal"
                              value={sessionalMarks}
                              onChange={(e) => setSessionalMarks(e.target.value)}
                              min="0"
                              max={selectedSubject.total_sessionalMarks - 4}
                              className="small-input"
                            />
                          </div>
                          <div className="input-group compact">
                            <label htmlFor="attendance">Attendance Marks (Max 4):</label>
                            <input
                              type="number"
                              id="attendance"
                              value={attendanceMarks}
                              onChange={(e) => setAttendanceMarks(e.target.value)}
                              min="0"
                              max="4"
                              className="small-input"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedSubject.total_termworkMarks > 0 && (
                      <div className="marks-input-group" id="termwork_input_container">
                        <div className="input-group compact">
                          <label htmlFor="termwork">Termwork Marks (Max {selectedSubject.total_termworkMarks}):</label>
                          <input
                            type="number"
                            id="termwork"
                            value={termworkMarks}
                            onChange={(e) => setTermworkMarks(e.target.value)}
                            min="0"
                            max={selectedSubject.total_termworkMarks}
                            className="small-input"
                          />
                        </div>
                      </div>
                    )}

                    {selectedSubject.total_externamMarks > 0 && (
                      <div className="marks-input-group" id="external_input_container">
                        <div className="input-group compact">
                          <label htmlFor="external">External Marks (Max {selectedSubject.total_externamMarks}):</label>
                          <input
                            type="number"
                            id="external"
                            value={externalMarks}
                            onChange={(e) => setExternalMarks(e.target.value)}
                            min="0"
                            max={selectedSubject.total_externamMarks}
                            className="small-input"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="button-group">
                    <button className="calculate-button" onClick={addOrUpdateSubjectResult}>
                      {editMode ? "Update Subject" : "Add Subject"}
                    </button>
                    <button
                      className="cancel-button"
                      onClick={() => {
                        setShowInputCard(false)
                        setEditMode(false)
                        setEditingResultId(null)
                        resetForm()
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {courseResults.length > 0 && (
            <div className="results-container">
              <h3>Subject Results</h3>
              <div className="semesters-container">
                <div className="subject-header">
                  <div className="subject-name">Subject</div>
                  <div className="subject-credit">Credits</div>
                  <div className="subject-marks">Marks</div>
                  <div className="subject-grade">Grade</div>
                  <div className="subject-actions">Actions</div>
                </div>

                {courseResults.map((result) => (
                  <div className="subject-row" key={result.id}>
                    <div className="subject-name">{result.subjectName}</div>
                    <div className="subject-credit">{result.credit}</div>
                    <div className="subject-marks">
                      {result.totalObtained}/{result.totalMarks}
                    </div>
                    <div className="subject-grade">
                      <span className={`bolder ${getGradeColorClass(result.points)}`}>
                        {result.grade} ({result.points})
                      </span>
                    </div>
                    <div className="subject-actions">
                      <button className="edit-button" onClick={() => editSubjectResult(result.id)} title="Edit">
                        <FaEdit />
                      </button>
                      <button className="delete-button" onClick={() => deleteSubjectResult(result.id)} title="Delete">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="details-toggle">
                <button className="toggle-button" onClick={() => setShowDetails(!showDetails)}>
                  {showDetails ? (
                    <>
                      Hide Details <FaChevronUp />
                    </>
                  ) : (
                    <>
                      Show Details <FaChevronDown />
                    </>
                  )}
                </button>
              </div>

              {showDetails && (
                <div className="subject-details-container">
                  <h4>Detailed Marks</h4>
                  {courseResults.map((result) => (
                    <div className="subject-details" key={`details-${result.id}`}>
                      <h5>
                        {result.subjectName} ({result.subjectCode})
                      </h5>
                      <div className="details-grid">
                        {result.total_sessionalMarks > 0 && (
                          <div className="detail-item">
                            <span className="detail-label">Sessional:</span>
                            <span className="detail-value">
                              {result.sessionalMarks + result.attendanceMarks}/{result.total_sessionalMarks}
                            </span>
                          </div>
                        )}
                        {result.total_termworkMarks > 0 && (
                          <div className="detail-item">
                            <span className="detail-label">Termwork:</span>
                            <span className="detail-value">
                              {result.termworkMarks}/{result.total_termworkMarks}
                            </span>
                          </div>
                        )}
                        {result.total_externamMarks > 0 && (
                          <div className="detail-item">
                            <span className="detail-label">External:</span>
                            <span className="detail-value">
                              {result.externalMarks}/{result.total_externamMarks}
                            </span>
                          </div>
                        )}
                        <div className="detail-item">
                          <span className="detail-label">Total:</span>
                          <span className="detail-value">
                            {result.totalObtained}/{result.totalMarks} ({result.percentage.toFixed(2)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {spi !== null && (
                <div className="spi-result-container">
                  <h3>Your Semester Performance Index (SPI)</h3>
                  <div className={`spi-value bolder ${getSpiColorClass()}`} id="spi">
                    {spi.toFixed(2)}
                  </div>
                  <div className="grade-description">
                    {spi >= 8.5
                      ? "Outstanding Performance!"
                      : spi >= 7.5
                        ? "Excellent Performance!"
                        : spi >= 6.5
                          ? "Very Good Performance!"
                          : spi >= 5.5
                            ? "Good Performance!"
                            : spi >= 4.5
                              ? "Average Performance"
                              : spi >= 4.0
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

