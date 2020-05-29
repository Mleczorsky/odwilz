const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');

async function accessSpreadsheet ( index = 1, arkusz) {
    const creds = require('./auth-keys/auth_data.json');
    const urls = [
        '1az3-gpKj-tcX0lhFYPuxNgGbeLtAs-JxX4kchvI7UEY',
        '1xlCUjRODq8L2tGkk5NQV6VqlHOtFnG1vpF5TFXe9ZNM',
        '1eyO00x4Uh3oJqevhvk26a1UOyf4ONiPTP0Y6lHK-JPY',
        '1sgM5wAT1yNiEbkL3X3bw5QD7lx7x1SgEYQKarEvAX7w',
        '1ViToCBbKQoFKjXC_73nEFFzOUNxFyxartZEMvv-xOmw',
        '1bwG6OvZxf2ga9uyTjLJoKxMqbUhYYHv6aeZY5MULoEk',
        '1ziwCkFtoHyoyLHrpsZE2i45EdKau0HjzqzDoJDx_U30',
        '18bXaiA_xa5xhH1AA2zINZtCf6f4HjdBeefc7y8o7D8'
    ]
    function countReactions ( row ) {
        const cell = row['jakiechceszdaćreakcje'].split(', ')
        return {
            likes : Number(cell.includes('Like') ),
            hearts : Number(cell.includes('Serduszko') ),
            wows : Number(cell.includes('Wow') ),
            bocians : Number(cell.includes('Bocian') )
        }
    }
    const doc = new GoogleSpreadsheet(urls[arkusz])
    await promisify(doc.useServiceAccountAuth)(creds);
    const info =  await promisify(doc.getInfo)();
    const sheet = info.worksheets[0];
    const rows = await promisify(sheet.getRows)({
        offset:index,
    });
    const summary = Array(8).fill({
        likes : 0,
        hearts : 0,
        wows : 0,
        bocians : 0,
    })
    index += rows.length;
    rows.forEach( ( row ) => {
        const resp = countReactions( row );
        summary[arkusz].likes += resp.likes;
        summary[arkusz].hearts += resp.hearts;
        summary[arkusz].wows += resp.wows;
        summary[arkusz].bocians += resp.bocians;
    })
    return {
        data:summary,
        row:index
    }
}
module.exports.accessSpreadsheet = accessSpreadsheet;