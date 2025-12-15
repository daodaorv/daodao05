/**
 * 表单验证工具
 * 提供常用的表单字段验证方法
 */

/**
 * 验证手机号
 * @param {string} phone - 待验证的手机号
 * @returns {boolean} 验证结果，true 表示格式正确
 * @example
 * validatePhone('13800138000') // true
 * validatePhone('12345678901') // false
 */
export function validatePhone(phone) {
  const reg = /^1[3-9]\d{9}$/
  return reg.test(phone)
}

/**
 * 验证邮箱
 * @param {string} email - 待验证的邮箱地址
 * @returns {boolean} 验证结果，true 表示格式正确
 * @example
 * validateEmail('test@example.com') // true
 * validateEmail('invalid-email') // false
 */
export function validateEmail(email) {
  const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  return reg.test(email)
}

/**
 * 验证身份证号
 * @param {string} idCard - 待验证的身份证号（支持15位或18位）
 * @returns {boolean} 验证结果，true 表示格式正确
 * @example
 * validateIdCard('110101199001011234') // true
 * validateIdCard('12345') // false
 */
export function validateIdCard(idCard) {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  return reg.test(idCard)
}

/**
 * 验证车牌号
 * @param {string} carNumber - 待验证的车牌号
 * @returns {boolean} 验证结果，true 表示格式正确
 * @example
 * validateCarNumber('京A12345') // true
 * validateCarNumber('ABC123') // false
 */
export function validateCarNumber(carNumber) {
  const reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-Z0-9]{4,5}[A-Z0-9挂学警港澳]$/
  return reg.test(carNumber)
}

/**
 * 验证密码强度
 * 要求：至少8位，包含大小写字母和数字
 * @param {string} password - 待验证的密码
 * @returns {boolean} 验证结果，true 表示符合强度要求
 * @example
 * validatePassword('Abc12345') // true
 * validatePassword('abc123') // false (缺少大写字母)
 * validatePassword('ABC123') // false (缺少小写字母)
 */
export function validatePassword(password) {
  const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
  return reg.test(password)
}

/**
 * 验证URL
 * @param {string} url - 待验证的URL地址
 * @returns {boolean} 验证结果，true 表示格式正确
 * @example
 * validateURL('https://www.example.com') // true
 * validateURL('not-a-url') // false
 */
export function validateURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * 验证金额
 * 支持整数和最多两位小数
 * @param {string|number} money - 待验证的金额
 * @returns {boolean} 验证结果，true 表示格式正确
 * @example
 * validateMoney('100') // true
 * validateMoney('100.50') // true
 * validateMoney('100.123') // false (超过两位小数)
 */
export function validateMoney(money) {
  const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
  return reg.test(money)
}

/**
 * 验证整数
 * 支持正整数、负整数和零
 * @param {string|number} num - 待验证的数字
 * @returns {boolean} 验证结果，true 表示是整数
 * @example
 * validateInteger('123') // true
 * validateInteger('-123') // true
 * validateInteger('123.45') // false
 */
export function validateInteger(num) {
  const reg = /^-?\d+$/
  return reg.test(num)
}

/**
 * 验证正整数
 * 只支持大于等于0的整数
 * @param {string|number} num - 待验证的数字
 * @returns {boolean} 验证结果，true 表示是正整数
 * @example
 * validatePositiveInteger('123') // true
 * validatePositiveInteger('0') // true
 * validatePositiveInteger('-123') // false
 */
export function validatePositiveInteger(num) {
  const reg = /^\d+$/
  return reg.test(num)
}

export default {
  validatePhone,
  validateEmail,
  validateIdCard,
  validateCarNumber,
  validatePassword,
  validateURL,
  validateMoney,
  validateInteger,
  validatePositiveInteger
}
