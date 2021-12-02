const fs = require('fs')
let data = fs.readFileSync('app.js', { encoding: 'utf8' }).split('\n')

const webAppsPath = './web-apps/apps/'
const endSubstring = "})"
const substrings = [{
    searchStr: "define('common/main/lib/controller/Protection'",
    addTopLines: 45,
    addBottomLines: 0,
    replaceStr: [{
        from: '',
        to: ''
    }]
},
{
    searchStr: "define('common/main/lib/view/Protection'",
    addTopLines: 46,
    addBottomLines: 0,
    replaceStr: [{
        from: '',
        to: ''
    }]
},
{
    searchStr: "define('documenteditor/main/app/controller/Main'",
    addTopLines: 42,
    addBottomLines: 0,
    replaceStr: [
        {
            from: "define\\('documenteditor/main/app/controller/Main',\\[",
            to: 'define(['
        },
        {
            from: "http://r7-office.ru/",
            to: '{{PUBLISHER_URL}}'
        },
        {
            from: "sales@r7-office.ru",
            to: '{{SALES_EMAIL}}'
        },
        {
            from: "Р7-Офис",
            to: '{{APP_TITLE_TEXT}}'
        },
        {
            from: "R7-Office",
            to: '{{COMPANY_NAME}}'
        },
    ]
},
{
    searchStr: "define('documenteditor/main/app/model/CryptoProModel'",
    addTopLines: 0,
    addBottomLines: 0,
    replaceStr: [{
        from: '',
        to: ''
    }]
},
{
    searchStr: "define('documenteditor/main/app/view/CryptoProSign'",
    addTopLines: 0,
    addBottomLines: 0,
    replaceStr: [{
        from: '',
        to: ''
    }]
},
{
    searchStr: "define('documenteditor/main/app/view/CryptoProDialog'",
    addTopLines: 0,
    addBottomLines: 0,
    replaceStr: [{
        from: '',
        to: ''
    }]
}
]

function saveFile(path, data) {
    const folders = path.split('/')
    folders.pop()
    folders.shift()
    let createFolders = '.'

    folders.forEach((folder) => {
        createFolders += `/${folder}`
        // console.log('\r\n\rcreateFolders', createFolders)
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
let indexSubstrings = -1;

for (let i = 0, len = data.length; i < len; i++) {
    const str = data[i]

    if (startIndex) {
        if ((str[0] === endSubstring[0]) && (str[1] === endSubstring[1])) {
            // console.log('Найдено завершение index', i)
            const module = data[startIndex].match(/'[^']+'/)[0].replace(/\'/g, '')

            fileData += `${str}`
            substrings[indexSubstrings].startIndex = startIndex
            substrings[indexSubstrings].endIndex = (i + 1)
            fileData = transformModule(fileData, substrings[indexSubstrings])
            saveFile(`${webAppsPath}${module}.js`, fileData)

            // reset params
            startIndex = 0
            indexSubstrings = -1
            fileData = ''
        } else {
            fileData += `${str}\r\n`
        }
    } else {
        indexSubstrings = substrings.findIndex(e => str.includes(e.searchStr))

        if (indexSubstrings != -1) {
            startIndex = i
            // console.log('\r\nНайдено совпадение:', str, 'startIndex', startIndex)
            fileData += `${str}\r\n`
        }
    }
}
function transformModule(moduleData, params) {
    // console.log(params)
    let header = ``;
    for (let i = (params.startIndex - params.addTopLines) , len = startIndex; i < len; i++) {
        header += `${data[i]}\r\n`
    }

    let footer = ``;
    for (let i = params.endIndex, len = (params.endIndex + params.addBottomLines); i < len; i++) {
        footer += `${data[i]}\r\n`
    }
    let result = header + moduleData + footer

    
    params.replaceStr.forEach(param => {
        const regex = new RegExp(param.from, "g")
        result = result.replace(regex, param.to)
    })
    return result
}

