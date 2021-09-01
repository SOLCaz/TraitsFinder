const getMetaData = require('metadata-scraper')

async function run() {
    const url = 'https://opensea.io/assets/0x5e198af285388ba69bd2475a2c60ed9a9b55098a/390'
    try {
        const data = await getMetaData(url)
        console.log(data)
    } catch (err) {
        console.log(err)
    }
}

run()