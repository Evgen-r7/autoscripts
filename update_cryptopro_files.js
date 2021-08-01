/*
    Расположить файл в каталоге built_tools, либо web-apps-cryptopro

    Схема каталогов
        documenteditors
            build_tools
            web-apps           //оригинальный каталог onlyoffice
            web-apps-cryptopro // изменения который необходимо произвести для интеграции криптопро функционала

    Что делает код
        * Выходит на уровнь выше, переходит в каталог web-apps-cryptopro.
        * Делает обновление кода криптопро командой git pull.
        * Cканирует все файлы в web-apps-cryptopro/web-apps
        * Переносит все файлы в web-apps
*/

const fs = require('fs'),
    path = require('path'),
    scandir = require('scandir'),
    WEB_APPS = 'web-apps',
    CRYPTOPRO = 'cryptopro',
    { spawnSync } = require('child_process');

const childProcess = spawnSync('git', ['pull']);

console.log('******* command [git pull] output BEGIN *******');
childProcess.output.forEach((e) => {
    if (!e) return;
    console.log(String(e));
});
console.log('******* command [git pull] output END *******');

getFiles()
    .then(copyFiles)
    .catch((err) => {
        console.error(err);
    });

function getFiles() {
    return new Promise((resolve, reject) => {
        let scan = scandir.create();
        let files = [];

        scan.on('file', (file, stats) => {
            files.push(file);
        });

        scan.on('error', (err) => {
            console.log('scandir err ', err);
            reject(err);
        });

        scan.on('end', () => {
            resolve(files);
        });

        scan.scan({
            dir: `../${WEB_APPS}-${CRYPTOPRO}/${WEB_APPS}`,
            recursive: true,
        });
    });
}

async function copyFiles(files) {
    if (!Array.isArray(files) || files.length < 1) {
        return console.error(`files is not Array ${files} or not found files`);
    }

    try {
        const promises = files.map(
            (e) =>
                new Promise((resolve, reject) => {
                    const source = path.resolve(e);
                    const reqex = new RegExp(`[\\\\|\/]${WEB_APPS}-${CRYPTOPRO}`);
                    const target = source.replace(reqex, '');

                    function ensureDirectoryExistence(target) {
                        var dirname = path.dirname(target);
                        if (fs.existsSync(dirname)) {
                            return true;
                        }
                        ensureDirectoryExistence(dirname);
                        fs.mkdirSync(dirname);
                    }

                    ensureDirectoryExistence(target);

                    fs.copyFile(source, target, (err) => {
                        if (err) {
                            console.error(`\n\rCopy error ${source} => ${target}`);
                            return reject(err);
                        }

                        console.log(`\n\rCopy success ${source}
             ${target}`);
                        resolve();
                    });
                }),
        );

        await Promise.all(promises);
        console.log(`\n\rSuccess copy ${promises.length} files!`);
    } catch (e) {
        console.error(e);
    }
}
