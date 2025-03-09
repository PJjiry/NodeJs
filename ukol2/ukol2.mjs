import fs from 'fs/promises';

async function createFilesFromInstructions() {

    try {
        const data = await fs.readFile('instrukce.txt', 'utf8');

        const n = parseInt(data.trim(),10);

        if (isNaN(n) || n < 0) {
            throw new Error('Nejedná se o číslo nebo je číslo menší než 0');
        }

        const promisesArray = [];
        for (let i = 0; i <= n; i++) {
            const filename = `${i}.txt`;
            const content = `Soubor ${i}`;
            promisesArray.push(fs.writeFile(filename, content, 'utf8'));
        }

        await Promise.all(promisesArray);

        console.log(`Úspěšně vytvořeno ${n + 1} souborů.`);
    } catch (error) {
        console.error('Chyba: Nepodařilo se vytvořit souboury');
    }
}

createFilesFromInstructions();