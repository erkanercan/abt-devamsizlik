import React, { useEffect, useState } from "react";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { Button, Card, Form, Alert, Spinner } from "react-bootstrap";
import "./Search.css";

const SPREADSHEET_ID = process.env.REACT_APP_SPREADSHEET_ID ?? "";
const SHEET_ID = process.env.REACT_APP_SHEET_ID ?? "";
const CLIENT_EMAIL = process.env.REACT_APP_GOOGLE_CLIENT_EMAIL ?? "";
const PRIVATE_KEY = process.env.REACT_APP_GOOGLE_SERVICE_PRIVATE_KEY ?? "";

function Search() {
  const [rows, setRowsData] = useState<any[]>([]);
  const [message, setMessage] = useState<string>("");
  const [alertVariant, setAlertVariant] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

    const appendSpreadsheet = async () => {
      await doc.useServiceAccountAuth({
        client_email: CLIENT_EMAIL,
        private_key: PRIVATE_KEY,
      });
      await doc.loadInfo(); // loads document properties and worksheets
      const sheet = doc.sheetsById[SHEET_ID];
      const rows = await sheet.getRows();
      setRowsData(rows);
      setLoading(false);
    };
    appendSpreadsheet();
  }, []);

  const onFormSubmit = (e: any) => {
    e.preventDefault();
    const inputValue = e.target.formBasicEmail.value;
    const unattendedDays = rows?.find((element) => element.Email === inputValue)?.UnattendedDays;
    if (unattendedDays) {
      if (unattendedDays <= 5) {
        setMessage(
          unattendedDays +
            " gün devamsızlığınız var.Katılım sertifikasını ödevi teslim etmese dahi alabilirsiniz. Ödevi teslim ederseniz ve devamsızlığınız 7 günü geçmezse, katılım + bitirme sertifikası alabilirsiniz.",
        );
        setAlertVariant("success");
      } else if (unattendedDays > 5 && unattendedDays <= 7) {
        setMessage(
          unattendedDays +
            " gün devamsızlığınız var.Ödevi teslim ettiğiniz takdirde katılım sertifikası + bitirme sertifikası alabilirsiniz.",
        );
        setAlertVariant("warning");
      } else if (unattendedDays > 8) {
        setMessage(
          unattendedDays + " gün devamsızlığınız var.Ödevi teslim etseniz dahi belge alamazsınız.",
        );
        setAlertVariant("danger");
      }
    } else {
      setMessage("E-posta adresi bulunamadı. Lütfen Discord sunucumuzdan bize ulaşın.");
      setAlertVariant("danger");
    }
  };

  return (
    <div>
      {message && <Alert variant={alertVariant}>{message}</Alert>}
      <Card style={{ position: "absolute" }}>
        <Form onSubmit={onFormSubmit}>
          <Form.Group controlId="formBasicEmail">
            <Form.Control disabled={loading} type="search" placeholder="E-posta adresi" />
          </Form.Group>
          <Button disabled={loading} type="submit" variant="primary" size="lg" block>
            {loading ? (
              <div>
                <Spinner as="span" animation="border" role="status" aria-hidden="true" />{" "}
                Yükleniyor...
              </div>
            ) : (
              "Ara"
            )}
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default Search;
