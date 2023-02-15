var html = document.getElementsByTagName('html')[0].innerHTML
if (html.indexOf('content="com.medium.reader"') != -1) {
    console.log('[START] The site is powered by Medium!')
    window.IS_MEDIUM_SITE = true;
}
window.IS_MEDIUM_SITE