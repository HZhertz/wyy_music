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
  },
  // 随机算法
  randomSelection(arr, num) {
    let n = arr.length
    for (let i = n - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr.slice(0, num)
  }
}
