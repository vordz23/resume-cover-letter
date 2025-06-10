import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const resumeFile = formData.get("resume") as File
    const jobDescription = formData.get("jobDescription") as string

    if (!resumeFile || !jobDescription) {
      return NextResponse.json({ error: "Resume file and job description are required" }, { status: 400 })
    }

    // Extract text from PDF (simplified for demo)
    let resumeText = ""
    try {
      // For demo purposes, we'll simulate PDF text extraction
      // In production, you would use pdf-parse here
      resumeText = await extractTextFromPDF(resumeFile)
    } catch (pdfError) {
      console.error("PDF parsing error:", pdfError)
      return NextResponse.json({ error: "Failed to parse PDF file" }, { status: 400 })
    }

    // Generate cover letter using AI (with fallback)
    let coverLetter = ""
    try {
      coverLetter = await generateCoverLetterWithAI(resumeText, jobDescription)
    } catch (aiError) {
      console.error("AI generation error:", aiError)
      // Fallback to template-based generation
      coverLetter = generateTemplateCoverLetter(resumeText, jobDescription)
    }

    return NextResponse.json({ coverLetter })
  } catch (error) {
    console.error("Error generating cover letter:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function extractTextFromPDF(file: File): Promise<string> {
  // Simulate PDF text extraction for demo
  // In production, use: const pdf = require('pdf-parse'); return pdf(buffer).then(data => data.text);
  return `
John Doe
Software Engineer
Email: john.doe@email.com
Phone: (555) 123-4567

EXPERIENCE:
- 5+ years of full-stack web development
- Proficient in React, Node.js, Python, and TypeScript
- Experience with cloud platforms (AWS, Azure)
- Strong background in database design and optimization
- Led development teams of 3-5 engineers

SKILLS:
- Frontend: React, Vue.js, HTML5, CSS3, JavaScript/TypeScript
- Backend: Node.js, Python, Java, REST APIs
- Databases: PostgreSQL, MongoDB, Redis
- Cloud: AWS, Docker, Kubernetes
- Tools: Git, Jenkins, Jira

EDUCATION:
Bachelor of Science in Computer Science
University of Technology, 2018
  `
}

async function generateCoverLetterWithAI(resumeText: string, jobDescription: string): Promise<string> {
  // For demo purposes, we'll return a template response
  // In production, you would use the AI SDK here

  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // This is where you would use the actual AI SDK:
  /*
  const { generateText } = await import('ai')
  const { openai } = await import('@ai-sdk/openai')
  
  const { text } = await generateText({
    model: openai('gpt-4o'),
    prompt: createCoverLetterPrompt(resumeText, jobDescription),
    maxTokens: 500,
  })
  return text
  */

  return generateTemplateCoverLetter(resumeText, jobDescription)
}

function generateTemplateCoverLetter(resumeText: string, jobDescription: string): string {
  // Extract key information from resume and job description
  const skills = extractSkills(resumeText)
  const experience = extractExperience(resumeText)
  const jobTitle = extractJobTitle(jobDescription)
  const companyName = extractCompanyName(jobDescription)

  return `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at ${companyName}. With ${experience} years of experience in software development and a proven track record of delivering high-quality solutions, I am excited about the opportunity to contribute to your team.

My technical expertise includes ${skills.slice(0, 3).join(", ")}, which aligns perfectly with the requirements outlined in your job posting. In my previous roles, I have successfully led development projects, collaborated with cross-functional teams, and implemented scalable solutions that have driven business growth.

What particularly excites me about this opportunity is the chance to work with cutting-edge technologies and contribute to innovative projects. I am passionate about writing clean, efficient code and staying current with industry best practices. My experience with both frontend and backend development, combined with my strong problem-solving skills, makes me well-suited for this role.

I would welcome the opportunity to discuss how my skills and experience can contribute to ${companyName}'s continued success. Thank you for considering my application, and I look forward to hearing from you soon.

Best regards,
[Your Name]`
}

function extractSkills(resumeText: string): string[] {
  const skillKeywords = [
    "React",
    "Node.js",
    "Python",
    "TypeScript",
    "JavaScript",
    "AWS",
    "Docker",
    "PostgreSQL",
    "MongoDB",
    "Vue.js",
    "Angular",
    "Java",
    "C++",
    "Git",
    "Kubernetes",
  ]
  return skillKeywords.filter((skill) => resumeText.toLowerCase().includes(skill.toLowerCase()))
}

function extractExperience(resumeText: string): string {
  const experienceMatch = resumeText.match(/(\d+)\+?\s*years?/i)
  return experienceMatch ? experienceMatch[1] : "3+"
}

function extractJobTitle(jobDescription: string): string {
  // Simple extraction - in production, you'd use more sophisticated NLP
  const commonTitles = [
    "Software Engineer",
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "DevOps Engineer",
    "Data Scientist",
    "Product Manager",
  ]
  const foundTitle = commonTitles.find((title) => jobDescription.toLowerCase().includes(title.toLowerCase()))
  return foundTitle || "Software Engineer"
}

function extractCompanyName(jobDescription: string): string {
  // Simple extraction - in production, you'd use more sophisticated parsing
  const lines = jobDescription.split("\n")
  for (const line of lines.slice(0, 5)) {
    if (line.trim() && !line.toLowerCase().includes("job") && !line.toLowerCase().includes("position")) {
      return line.trim()
    }
  }
  return "your company"
}

function createCoverLetterPrompt(resumeText: string, jobDescription: string): string {
  return `
You are a professional career advisor and expert cover letter writer. Based on the provided resume and job description, write a compelling, tailored cover letter.

RESUME CONTENT:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

INSTRUCTIONS:
1. Write a professional cover letter that is under 350 words
2. Highlight relevant skills and experiences from the resume that match the job requirements
3. Show enthusiasm for the specific role and company
4. Use a professional but engaging tone
5. Include a strong opening that grabs attention
6. End with a clear call to action
7. Make it feel personal and tailored, not generic
8. Focus on value proposition - what the candidate can bring to the role

FORMAT:
- Start with a professional greeting
- 3-4 paragraphs maximum
- Professional closing
- Do not include placeholder text like [Your Name] or [Company Name]

Write the cover letter now:
`
}
