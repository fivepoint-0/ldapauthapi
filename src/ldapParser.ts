class LdapParser {
    public static parseMemberOfLine(s: string) {
        let splitByEquals = s.split(',').map(_s => _s.split('='))
        let returnValue = {}
        for (let obj of splitByEquals) {
            if (returnValue.hasOwnProperty(obj[0])) {
                if (Array.isArray(returnValue[obj[0]])) {
                    returnValue[obj[0]].push(obj[1])
                } else {
                    returnValue[obj[0]] = [returnValue[obj[0]], obj[1]]
                }
            } else {
                returnValue[obj[0]] = obj[1]
            }
        }
        return returnValue
    }
}

export { LdapParser }