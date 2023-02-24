import fs from 'fs'
import path from 'path'
import progress from 'cli-progress'
import { Questions, QuestionId, Language, Question } from './types'
import questions from '../data/questions.json' assert { type: 'json' }

/**
 * Uses Nunito for other languages or Noto for Chinese
 * @param {boolean}
 * @returns {string}
 */
export const getFont = (isZH: boolean) =>
  isZH ? './assets/NotoSansSC-Bold.otf' : './assets/static/Nunito-Bold.ttf'

/**
 * Returns an array of questions with the following properties
 * id: question id
 * lang: language
 * questions: the question string
 * @returns {Questions}
 */
export const getAllQuestions = (): Questions =>
  Object.entries(questions)
    .map(([id, questionsList]) =>
      Object.keys(questionsList).map(
        (lang) =>
          ({
            id,
            lang,
            question: questions[id as QuestionId][lang as Language],
          } as Question)
      )
    )
    .flat()

/**
 *
 * @returns
 */
export const getAllQuestionIds = (): QuestionId[] =>
  Object.keys(questions) as QuestionId[]

export const getAllLanguages = (): Language[] =>
  Object.keys(questions[1]) as Language[]

/**
 * Cleans and creates language directories recursively
 * @param {string}
 */
export const resetLanguageDirs = (baseDir: string) => {
  // fs.rmSync(baseDir, { force: true, recursive: true,  })
  getAllLanguages().forEach((lang) =>
    fs.mkdirSync(path.join(baseDir, lang), { recursive: true })
  )
}

/**
 * Creates a progress bar
 * @returns
 */
export const createProgressBar = () =>
  new progress.SingleBar(
    {
      format: '{bar} {percentage}% || {value}/{total} Images',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true,
      stopOnComplete: true,
    },
    progress.Presets.rect
  )
