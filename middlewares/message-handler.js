module.exports = (req, res, next) => {
  //透過middleware將flash訊息儲存在res.locals中
  res.locals.success_msg = req.flash('success')
  res.locals.error_msg = req.flash('error')

  next()
}