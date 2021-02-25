exports.message_401 = res => {
    return res.render('401')
}
exports.message_alreadyExists = (res, data) => {
    return res.render('already_exists', {data})
}
exports.message_404 = (res, data) => {
    return res.render('error_404', {data})
}
exports.message_500 = res => {
    return res.render('error_500')
}
exports.message_400 = res => {
    return res.render('error_400')
}