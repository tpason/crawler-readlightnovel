const Crawler = require("crawler")
const _ = require("lodash")
require("./fireBaseConfig");

import { pushNewsList, trimContent, convertContent, isArray, pusContent, writeDatabase } from "./Utils";

// init newsList
let listNews = []
let listNewsWithContent = []
let length = 0
let key = 0
let isNotQueue = false

const c = new Crawler({
  maxConnections: 1,
  // This will be called for each crawled page
  callback: function (error, res, done) {
    if (error) {
      console.log(error)
    } else {
      const $ = res.$
      const uri = res.options.uri
      const optionsLength = res.options.length
      const optionsKey = res.options.optionsKey
      isNotQueue = res.options.isNotQueue
      if (typeof optionsKey !== "undefined") {
        key = optionsKey
      }
      if (typeof optionsLength !== "undefined" && length !== optionsLength) {
        length = optionsLength
      }

      $('ul.chapter-chs li a').each(function () {
        const url = `${$(this).attr('href')}`
        const arrHREF = url.split('/')
        const chap = arrHREF[arrHREF.length - 1]
        const volume = arrHREF[arrHREF.length - 2]
        const news = { url, chap, volume }
        listNews = pushNewsList({ listNews, news })
      });

      // add content to firebase
      let contentHtml = $('.chapter-content3').html()
      if (contentHtml) {
        const content = trimContent($.load(convertContent(contentHtml)).text())
        if (!isArray(listNewsWithContent) && isArray(listNews)) {
          listNewsWithContent = [...listNews]
        }
        const newsContent = pusContent({ listNews: listNewsWithContent, content, uri })
        listNewsWithContent = [...newsContent]
      }
    }

    if (!isNotQueue && isArray(listNews)) {
      listNews.map(({ url: uri }, optionsKey) => {
        c.queue({ uri, length: listNews.length, optionsKey, isNotQueue: true })
      })
    }

    if (length - 1 === key) {
      listNewsWithContent.map(content => {
        const columnPath = `${content.volume}/${content.chap}`
        writeDatabase({ columnPath, content })
      })
    }
    done()
  }
});

// Queue just one URL, with default callback
c.queue('https://www.readlightnovel.org/second-life-ranker');
// c.queue('https://www.readlightnovel.org/second-life-ranker/volume-1/chapter-1');
