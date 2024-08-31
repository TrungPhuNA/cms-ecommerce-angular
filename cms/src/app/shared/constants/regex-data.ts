export const RegexUrl = new RegExp('^(http:\\/\\/|https:\\/\\/)' + // giao thức
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // tên miền
    '((\\d{1,3}\\.){3}\\d{1,3}))'); // hoặc địa chỉ IP

export const Regex = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    link: RegexUrl,
    number: /^-?([0]{1}\.{1}[0-9]+|[1-9]{1}[0-9]*\.{1}[0-9]+|[0-9]+|0)$/,
};

export const REGEX_USERNAME = /^[a-z0-9A-Z]+(?:[A-Za-z0-9]+)*$/;
export const REGEX_USERNAME_LOGIN = /^[a-z0-9_]+$/;
export const REGEX_NAME = /^[\p{L}\s]+$/u;
export const REGEX_EMAIL =/^\s*[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}\s*$/;
export const REGEX_LINK = /^(https?:\/\/)[\w.-]+(?:\.[\w\.-]+)+(?:\/[\w\-\._~:\/?#[\]@!$&'()*+,;=%]*)?$/;
export const REGEX_LINK_V2 = /^(https:\/\/www\.|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
export const REGEX_LINK_V3 = /^(https?:\/\/)?(www\.)?[\w.-]+\.[a-zA-Z]{2,}(?:\.[\w\.-]+)*(?:\/[\w\-\._~:\/?#[\]@!$&'()*+,;=%]*)?$/;
export const REGEX_PHONE_VN = /^(0)*[1|2|3|5|6|7|8|9][0-9]{8}$/
export const REGEX_PHONE = /^(0|\+84|84|\+840|840)[1|2|3|5|6|7|8|9][0-9]{8}$/


