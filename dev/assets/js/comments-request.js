export default (method, params, id = '') => {
  return $.ajax({
    url: `http://frontend-test.pingbull.com/pages/viktorsua@gmail.com/comments/${id}`,
    method,
    dateType: 'json',
    data: params
  });
}