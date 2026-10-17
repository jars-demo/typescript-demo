// Site-wide content. The type errors are the exact messages tsc 6.0.3 prints for these snippets
// (strict, noUncheckedIndexedAccess); the terminal session is real output from the Streak CLI.

export const REPO_URL = 'https://github.com/jars-demo/typescript-demo'

export type Example = {
  label: string
  /** The code, with the part tsc complains about wrapped in [[ ]]. */
  broken: string
  fixed: string
  error: string
}

export const EXAMPLES: Example[] = [
  {
    label: 'Wrong type',
    broken: `function greet(name: string) {
  return \`Hi, \${name}!\`
}

greet([[42]])`,
    fixed: `function greet(name: string) {
  return \`Hi, \${name}!\`
}

greet('Ada')`,
    error: "Argument of type 'number' is not assignable to parameter of type 'string'.",
  },
  {
    label: 'Typo',
    broken: `interface User {
  name: string
}

const user: User = { name: 'Ada' }
user.[[nmae]]`,
    fixed: `interface User {
  name: string
}

const user: User = { name: 'Ada' }
user.name`,
    error: "Property 'nmae' does not exist on type 'User'.",
  },
  {
    label: 'Maybe missing',
    broken: `const habits: string[] = []

[[habits[0]]].toUpperCase()`,
    fixed: `const habits: string[] = []

habits[0]?.toUpperCase()`,
    error: "Object is possibly 'undefined'.",
  },
]

export const SESSION = `$ npm run streak -- add Read --emoji 📚
Added 📚 Read (id: read)
$ npm run streak -- check read
📚 Read (daily): 1 day in a row
$ npm run streak -- check read
You already checked in on 2026-10-17.
$ npm run streak -- list
read           📚 Read (daily): 1 day in a row`

export const QUICKSTART = `git clone https://github.com/jars-demo/typescript-demo.git
cd typescript-demo
npm ci
npm test`

export const LEARN = [
  {
    title: 'Types you already use',
    body: 'Strings, numbers, arrays, objects. Let inference do most of the work.',
  },
  {
    title: 'Unions and narrowing',
    body: 'Model "this or that" exactly, and let the checker follow your if statements.',
  },
  {
    title: 'Generics',
    body: 'Write a helper once and keep the types of whatever passes through it.',
  },
  {
    title: 'Safe outside data',
    body: 'JSON arrives as unknown. Type guards turn it into data you can trust.',
  },
  {
    title: 'Errors as values',
    body: 'A Result type makes failure part of the signature, so nobody forgets it.',
  },
  {
    title: 'Tests and a real CLI',
    body: 'Vitest for behaviour, tsc for types, and a build you can run with node.',
  },
]
