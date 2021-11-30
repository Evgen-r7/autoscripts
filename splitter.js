const fs = require('fs')
let data = fs.readFileSync('app.js', { encoding: 'utf8' }).split('\n')

const webAppsPath = './web-apps/apps/'
const substrings = [
    "define('common/main/lib/controller/Protection'",
    "define('common/main/lib/view/Protection'",

    "define('documenteditor/main/app/controller/Main'",

    "define('documenteditor/main/app/model/CryptoProModel'",
    "define('documenteditor/main/app/view/CryptoProSign'",
    "define('documenteditor/main/app/view/CryptoProDialog'"
]
const endSubstring = "})"

function saveFile(path, data) {
    const folders = path.split('/')
    folders.pop()
    folders.shift()
    let createFolders = '.'

    folders.forEach((folder) => {
        createFolders += `/${folder}`
        console.log('\n\rcreateFolders', createFolders)
        try {
            fs.mkdirSync(createFolders);
        } catch(err) {}
    })
    fs.writeFileSync(path, data)
}

// remove src
try {
    fs.rmdirSync(webAppsPath.split('/')[1], { recursive: true });
} catch(err) {
    console.error(err);
}

let fileData = ``
let startIndex = 0;
for (let i = 0, len = data.length; i < len; i++) {
    const str = data[i]

    if (startIndex) {
        if ((str[0] === endSubstring[0]) && (str[1] === endSubstring[1])) {
            console.log('Найдено завершение index', i)
            const module = data[startIndex].match(/'[^']+'/)[0].replace(/\'/g, '')

            startIndex = 0
            fileData += `${str}`
            saveFile(`${webAppsPath}${module}.js`, fileData)
            fileData = ''
        } else {
            fileData += `${str}\n`
        }
    } else {
        if (substrings.some(substr => str.includes(substr))) {
            startIndex = i
            console.log('')
            console.log('')
            console.log('Найдено совпадение:', str, 'startIndex', startIndex)
            fileData += `${str}\n`
        }
    }
}