module.exports = (error, req, res, next) => {
  console.error(error)
  req.flash('error', error.errorMessage || '處理失敗:(')
  res.redirect('back')

  //將error傳遞給Express的錯誤處理機制
  next(error)
}