import fs from 'fs';

fs.readFile('instrukce.txt',  (err, data) => {
    if (err) {
        console.error('Nastala chyba během čtení souboru.');
        return;
    }

    const [sourceFile, targetFile] = data.toString().trim().split(' ');
    if (!sourceFile || !targetFile) {
        console.error('Soubor "instrukce.txt" musí obsahovat oba názvy souborů.');
        return;
    }

    fs.readFile(sourceFile, (err, content) => {
        if (err) {
            console.error(`Chyba při čtení souboru '${sourceFile}'`);
            return;
        }

        fs.writeFile(targetFile, content, (err) => {
            if (err) {
                console.error(`Chyba při zápisu do souboru '${targetFile}'`);
            } else {
                console.log(`Data byla úspěšně zkopírována ze souboru '${sourceFile}' do souboru '${targetFile}'.`);
            }
        });
    });
});
