const passwordRegEx =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,1024}$/;
const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegEx =
  /^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)$/;
const phoneRegEx = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s/0-9]*$/;
const notValidCredantials = "Email or password is wrong";

module.exports = {
  passwordRegEx,
  emailRegEx,
  nameRegEx,
  phoneRegEx,
  notValidCredantials,
};
