import { database } from "./fireBaseConfig";

export const isArray = arr => Array.isArray(arr) && arr.length > 0
export const existing = obj => typeof obj !== "undefined" && obj !== null
export const pushNewsList = ({ listNews, news }) => {
  const isFound = listNews.some(el => el.url === news.url)
  !isFound && listNews.push(news)
  return listNews
}
export const pusContent = ({ listNews, content, uri }) => {
  const listNewsWithContent = listNews.map(news => {
    if (news.url === uri) {
      return { ...news, lang: { en: content } }
    }
    return news
  })
  return listNewsWithContent
}
export const pipe = (...fns) => x =>
  fns.reduce(
    (v, f) => (isArray(v) ? v.map(f) : existing(v) ? f(v) : v),
    x
  )
export const removeScriptTag = str => str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
export const removeRowClass = str => str.replace(/(<div class="row">|<div class="col-md-6">|<div class="col-md-4">)[^<]*(?:(?!<\/div>)<[^<]*)*<\/div>/gi, '')
export const trimContent = str => str.trim()
export const convertContent = pipe(removeScriptTag, removeRowClass)

export const writeDatabase = ({ columnPath, content }) => database.ref(columnPath).set(content);
