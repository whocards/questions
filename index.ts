import fs from "fs"
const API_KEY = process.env.SHEET_API_KEY
const SHEET_ID = process.env.SHEET_ID

const range = "Sheet1!A1:Z"
const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}`

type RawData = Array<Array<string>>
interface Res {
  range: string
  values: RawData
}

let rawData: RawData

const getSheet = async () => {
  const data: Res = await await fetch(`${sheetUrl}?key=${API_KEY}`).then((r) =>
    r.json()
  )
  rawData = data.values
}

const getSingleLanguageQuestions = (language: string) => {
  const lang = language.toLowerCase()
  const index = rawData[0].findIndex((i) => i.toLowerCase() === lang)
  // validate language exists
  if (index < 0) throw Error(`${lang} not found`)

  const questions: Record<number, string> = {}

  for (let i = 2; i < rawData.length; ++i) {
    questions[parseInt(rawData[i][0])] = rawData[i][index]
  }

  return questions
}

const writeSingleLanguage = async (language: string) => {
  const data = getSingleLanguageQuestions(language)
  await Bun.write(`./languages/${language}.json`, JSON.stringify(data, null, 2))
}

const writeAllSingleLanguages = async () => {
  await rawData[0].filter(Boolean).forEach(async (lang) => {
    await writeSingleLanguage(lang.toLowerCase())
  })
}

const run = async () => {
  await getSheet()

  writeAllSingleLanguages()
}

run()
