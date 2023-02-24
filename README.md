# WhoCards Questions

Separate files for all questions and a single combined file as well

This data is auto generated from the [all languages combined](https://docs.google.com/spreadsheets/d/1khmUFsF2PYR6tmUd_7eBEDTtlXVoo2qhcyuQl354BXw) spreadsheet

To build the languages:

1. clone this repo
1. `cp .env.example .env` and fill in the variables
1. `pnpm install`
1. `pnpm build`

## Next step TODO and document

The way this is meant to be used is as a helper CLI for any whocards repo. Install from github `pnpm i whocards/questions` and then the following scripts should be available to add to your pipeline

### `make:questions`

- **required** output directory
- options for specific language (default all)
- supported languages file (default true)
- overwrite directory (default true)

### `make:image`

- **required** output directory
- input image file (with default) by size or aspect ratio?
- fonts (default nunito & noto-sans)
- single language or all (default all)

### `question`

- get a question from the API
- option for lang

### Types

- export types for all questions

## Questions to answer

- how to pass env vars necessary
- speed up image build
- utils for getting questions by language, or by question number
