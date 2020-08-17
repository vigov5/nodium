// var data = { type: "FROM_PAGE", text: "Hello from the webpage!" };
// window.postMessage(data, "*");
var nodiumDetector1 = [
  "post-article|first-post-viewed-timestamp",
  "post-article|posts-viewed-today-count",
  "post-article|first-post-viewed-month-timestamp",
  "post-article|posts-viewed-month-count",
  "post-article|first-post-viewed-today-timestamp",
  "post-article|non-moc-posts-viewed-month-count"
].some((key) => localStorage.getItem(key) != null);

var nodiumDetector2 = [
  "branch_session_first",
  "branch_session"
].some((key) => {
  let data = localStorage.getItem(key);
  if (data) {
    return JSON.parse(data).link.indexOf("medium.com") != -1;
  }
});
[nodiumDetector1 || nodiumDetector2, location.origin, location.href];
