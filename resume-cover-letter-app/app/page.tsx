"use client"

import type React from "react"
import { useState } from "react"
import { Upload, FileText, Briefcase, Download, Copy, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

export default function Home() {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const [coverLetter, setCoverLetter] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setResumeFile(file)
      setError("")
      setSuccess("Resume uploaded successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } else {
      setError("Please upload a valid PDF file")
      setResumeFile(null)
    }
  }

  const generateCoverLetter = async () => {
    if (!resumeFile || !jobDescription.trim()) {
      setError("Please upload a resume and enter a job description")
      return
    }

    setIsLoading(true)
    setError("")
    setCoverLetter("")

    try {
      const formData = new FormData()
      formData.append("resume", resumeFile)
      formData.append("jobDescription", jobDescription)

      const response = await fetch("/api/generate-cover-letter", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate cover letter")
      }

      setCoverLetter(data.coverLetter)
      setSuccess("Cover letter generated successfully!")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate cover letter. Please try again."
      setError(errorMessage)
      console.error("Generation error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(coverLetter)
      setSuccess("Cover letter copied to clipboard!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError("Failed to copy to clipboard")
    }
  }

  const downloadCoverLetter = () => {
    try {
      const blob = new Blob([coverLetter], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "cover-letter.txt"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setSuccess("Cover letter downloaded!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError("Failed to download cover letter")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Cover Letter Generator</h1>
        <p className="text-lg text-gray-600">
          Upload your resume and job description to generate a tailored cover letter
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Resume Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Upload Resume
            </CardTitle>
            <CardDescription>Upload your resume in PDF format</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" id="resume-upload" />
              <label htmlFor="resume-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600">
                  {resumeFile ? (
                    <span className="text-green-600 font-medium">{resumeFile.name}</span>
                  ) : (
                    "Click to upload PDF"
                  )}
                </p>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Job Description */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Job Description
            </CardTitle>
            <CardDescription>Paste the job description you're applying for</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[200px] resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">{jobDescription.length} characters</p>
          </CardContent>
        </Card>
      </div>

      {/* Generate Button */}
      <div className="text-center mb-8">
        <Button
          onClick={generateCoverLetter}
          disabled={isLoading || !resumeFile || !jobDescription.trim()}
          className="px-8 py-3 text-lg"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Generating Cover Letter...
            </>
          ) : (
            "Generate Cover Letter"
          )}
        </Button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6 flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-green-500 flex-shrink-0"></div>
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Cover Letter Result */}
      {coverLetter && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Cover Letter</CardTitle>
            <CardDescription>Your tailored cover letter is ready</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-6 rounded-lg mb-4 border">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans text-gray-800">{coverLetter}</pre>
            </div>
            <div className="flex gap-4 flex-wrap">
              <Button onClick={copyToClipboard} variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                Copy to Clipboard
              </Button>
              <Button onClick={downloadCoverLetter} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download as Text
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-4">Word count: {coverLetter.split(" ").length} words</p>
          </CardContent>
        </Card>
      )}

      {/* Demo Instructions */}
      <Card className="mt-8 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Demo Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-blue-700 text-sm space-y-2">
            <p>• Upload any PDF file (the demo will simulate resume parsing)</p>
            <p>• Enter a job description in the text area</p>
            <p>• Click "Generate Cover Letter" to see the AI-powered result</p>
            <p>• The demo uses template-based generation for reliability</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
