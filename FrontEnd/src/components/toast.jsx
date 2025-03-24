"use client"

import { useState, useEffect } from "react"

export const ToastContainer = ({ position = "top-right" }) => {
  const [toasts, setToasts] = useState([])

  // Global toast event listener
  useEffect(() => {
    const handleToast = (event) => {
      const { message, type, duration } = event.detail

      const newToast = {
        id: Date.now(),
        message,
        type: type || "info",
        duration: duration || 3000,
      }

      setToasts((prev) => [...prev, newToast])

      // Auto remove toast after duration
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== newToast.id))
      }, newToast.duration)
    }

    window.addEventListener("show-toast", handleToast)

    return () => {
      window.removeEventListener("show-toast", handleToast)
    }
  }, [])

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <div className={`toast-container ${position}`}>
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`} onClick={() => removeToast(toast.id)}>
          <div className="toast-message">{toast.message}</div>
          <button className="toast-close">&times;</button>
        </div>
      ))}
    </div>
  )
}

// Helper function to show toast
export const showToast = (message, type = "info", duration = 3000) => {
  const event = new CustomEvent("show-toast", {
    detail: { message, type, duration },
  })
  window.dispatchEvent(event)
}

