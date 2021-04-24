const { GoogleSpreadsheet } = require('google-spreadsheet');

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_ID = process.env.SHEET_ID;
const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_SERVICE_PRIVATE_KEY;

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.checkAttendance = async (req, res) => {

    //CORS
    res.set('Access-Control-Allow-Origin', "*")
    res.set('Access-Control-Allow-Methods', 'GET, POST')

    if (req.query.email) {
        try {
            const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

            await doc.useServiceAccountAuth({
                client_email: CLIENT_EMAIL,
                private_key: PRIVATE_KEY.replace(/\\n/g, "\n"),
            });

            await doc.loadInfo(); // loads document properties and worksheets

            const sheet = doc.sheetsById[SHEET_ID];
            const rows = await sheet.getRows();

            const unattendedDays = rows.find((element) => element.Email === req.query.email)?.UnattendedDays;

            if (unattendedDays) {
                res.status(200).send({ "data": { "unattendedDays": unattendedDays }, "error": null });
            } else {
                res.status(404).send({ "data": {}, "error": "E-posta adresi bulunamadı." });
            }

        } catch (error) {
            res.status(500).send({ "data": {}, "error": error });
        }
    } else {
        res.status(200).send({ "data": {}, "error": "Hatalı istek" });
    }
};
