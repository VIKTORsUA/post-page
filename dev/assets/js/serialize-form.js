export default $form => {
  const params = {};
  $form.serializeArray().map((item) => params[item.name] = item.value);
  return params;
}