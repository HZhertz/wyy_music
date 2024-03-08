export default {
  // 数字过万的处理
  formartNum(val) {
    let num = 0
    if (val > 9999) {
      num = Math.round((val / 10000) * 10) / 10 + '万'
    } else {
      num = val
    }

    return num
  }
}
