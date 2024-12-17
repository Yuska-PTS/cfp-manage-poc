const COUNTY_CODE = {
  A: 10,
  B: 11,
  C: 12,
  D: 13,
  E: 14,
  F: 15,
  G: 16,
  H: 17,
  I: 34,
  J: 18,
  K: 19,
  L: 20,
  M: 21,
  N: 22,
  O: 35,
  P: 23,
  Q: 24,
  R: 25,
  S: 26,
  T: 27,
  U: 28,
  V: 29,
  W: 32,
  X: 30,
  Y: 31,
  Z: 33
} as const

type CountyCodeKey = keyof typeof COUNTY_CODE

const ID_LOGICAL_MULTIPLIER = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1]

export function validateNationalIdNo(value: string): boolean {
  if (!/^[a-zA-Z](1|2)\d{8}$/.test(value)) {
    return false
  }

  const countyValue = COUNTY_CODE[value[0].toUpperCase() as CountyCodeKey]

  const restDigits = value
    .slice(1)
    .split('')
    .map((char) => parseInt(char))

  const digits = [Math.floor(countyValue / 10), countyValue % 10, ...restDigits]

  const sum = digits.reduce((accumulator, currentValue, index) => {
    return accumulator + currentValue * ID_LOGICAL_MULTIPLIER[index]
  }, 0)

  return sum % 10 === 0
}

// ---------------------------------------------------

/**
 * valid url example:
 * https://www.youtube.com/watch?v=Awz_CG2320E
 * https://youtu.be/y-ZfIxa6dhY
 * https://www.youtube.com/v/Awz_CG2320E
 * https://m.youtube.com/v/y-ZfIxa6dhY
 *
 * about the format of youtube video id, see:
 * https://webapps.stackexchange.com/questions/54443/format-for-id-of-youtube-video
 */

// NOTE:
// [\w_-]{10,} is the regular expression for video id
const urlRegExps = [
  /^(https:\/\/)?www\.youtube\.com\/watch\?(.*&)?v=[\w_-]{10,}/,
  /^(https:\/\/)?youtu\.be\/[\w_-]{10,}/,
  /^(https:\/\/)?www\.youtube\.com\/v\/[\w_-]{10,}/,
  /^(https:\/\/)?m\.youtube\.com\/v\/[\w_-]{10,}/
]

export function validateYoutubeUrl(url = '') {
  url = url.trim()

  let isValid = false
  for (const reg of urlRegExps) {
    isValid = reg.test(url)
    if (isValid) {
      break
    }
  }

  return isValid
}

// ---------------------------------------------------

// GUI: Government Uniform Invoice number (統一編號)
const GUI_LOGICAL_MULTIPLIER = [1, 2, 1, 2, 1, 2, 4, 1]

export function validateGuiNumber(value: string) {
  if (!/^\d{8}$/.test(value)) {
    return false
  }

  const digits = value.split('').map((char) => parseInt(char))
  const hasSecondLogic = digits[6] === 7

  function digitSum(value: number) {
    if (value < 10) {
      return value
    }

    const first = Math.floor(value / 10)
    const second = value % 10

    return digitSum(first + second)
  }

  const multiplyResults = digits.map((digit, index) => {
    const multiplyValue = digit * GUI_LOGICAL_MULTIPLIER[index]
    return digitSum(multiplyValue)
  })

  const sum = multiplyResults.reduce((accumulator, currentValue) => {
    return accumulator + currentValue
  }, 0)

  if (sum % 5 === 0) {
    return true
  }

  if (hasSecondLogic && (sum - 1) % 5 === 0) {
    return true
  }

  return false
}
