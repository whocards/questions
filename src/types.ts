import questions from '../data/questions.json' assert { type: 'json' }

export type QuestionId = keyof typeof questions
export type Language = keyof typeof questions[1]

export interface Question {
  id: QuestionId
  lang: Language
  question: string
}

export type Questions = Question[]
