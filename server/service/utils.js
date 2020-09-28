const check_list = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
];

/**
 * 根据clientid计算是否在灰度中
 * @param {*} clientid
 * @param {*} proption
 */
function checkActive(clientid, proption) {
    if (!clientid || proption === 0) return false;
    if (proption === 100) return true;
    let checkStr = clientid.toLowerCase();
    if (checkStr.length < 2) return false;
    let prece = check_list.indexOf(checkStr[checkStr.length - 1]);
    prece += check_list.indexOf(checkStr[checkStr.length - 2]) * 10;
    if (isNaN(prece)) return false;
    return prece % 100 < proption;
}

module.exports = {
    checkActive,
};
