process.removeAllListeners('warning')

import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

const API_KEY = process.env.SHEET_API_KEY

const SHEET_ID = '1khmUFsF2PYR6tmUd_7eBEDTtlXVoo2qhcyuQl354BXw'
const range = 'Sheet1!A1:Z'
const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}`

type RawData = Array<Array<string>>
interface Res {
  range: string
  values: RawData
}
type Questions = Record<number | string, string>

let rawData: RawData

const getSheet = async () => {
  const data: Res = await fetch(`${sheetUrl}?key=${API_KEY}`).then((r) =>
    r.json()
  )
  // cleanup
  rawData = data.values
  rawData[0] = rawData[0].map((i) => i.toLowerCase())
  rawData[1] = rawData[1].map((i) => capitalize(i))
}

const writeSingleLanguage = async (lang: string) => {
  const index = rawData[0].findIndex((i) => i === lang)
  // validate language exists
  if (index < 0) throw Error(`${lang} not found`)

  const questions: Questions = {}

  for (let i = 2; i < rawData.length; ++i) {
    questions[parseInt(rawData[i][0])] = rawData[i][index]
  }

  await writeJsonFile(lang, { language: lang, questions }, 'languages')
}

const writeAllSingleLanguages = async () => {
  await rawData[0].filter(Boolean).forEach(async (lang) => {
    await writeSingleLanguage(lang)
  })
}

const writeAllLanguages = async () => {
  const questions: Record<number, Questions> = {}

  for (let q = 2; q < rawData.length; ++q) {
    const id = parseInt(rawData[q][0])
    questions[id] = {}
    for (let l = 1; l < rawData[0].length; ++l) {
      const lang = rawData[0][l]
      questions[id][lang] = rawData[q][l]
    }
  }

  await writeJsonFile('questions', questions)
}

const writeSupportedLanguages = async () => {
  const languages: Record<string, string> = {}

  for (let l = 1; l < rawData[0].length; ++l) {
    languages[rawData[0][l]] = rawData[1][l]
  }

  await writeJsonFile('languages', languages)
}

// utils
const stringify = (data: object) => JSON.stringify(data, null, 2)

const capitalize = (str: string) =>
  str ? str[0].toUpperCase() + str.slice(1).toLowerCase() : str

const writeJsonFile = async (name: string, data: object, dir?: string) => {
  const filePath = ['data', dir, name].filter(Boolean).join('/') + '.json'
  await fs.writeFileSync(filePath, stringify(data))
  console.log('OK:', filePath)
}

const run = async () => {
  await getSheet()

  writeAllSingleLanguages()
  writeAllLanguages()
  writeSupportedLanguages()
}

run()
