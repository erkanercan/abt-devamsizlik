import React, { useState } from "react";
import { Button, Card, Form, Alert, Spinner } from "react-bootstrap";
import "./Search.css";

function Search() {
  const [message, setMessage] = useState<string>("");
  const [alertVariant, setAlertVariant] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const onFormSubmit = (e: any) => {
    e.preventDefault();
    const inputValue = e.target.formBasicEmail.value;
    setLoading(true);
    fetch(
      `https://us-central1-androidbootcampturkey.cloudfunctions.net/check-attendance?email=${inputValue}`,
    )
      .then((response) => response.json())
      .then((resp: any) => {
        if (resp.error) {
          setMessage("E-posta adresi bulunamadı. Lütfen Discord sunucumuzdan bize ulaşın.");
          setAlertVariant("danger");
          setLoading(false);
          return;
        }
        const unattendedDays = resp.data.unattendedDays;
        if (unattendedDays) {
          setLoading(false);
          if (unattendedDays <= 5) {
            setMessage(
              unattendedDays +
                " gün devamsızlığınız var. Katılım sertifikasını ödevi teslim etmeseniz dahi alabilirsiniz. Ödevi teslim ederseniz ve devamsızlığınız 7 günü geçmezse, katılım + bitirme sertifikası alabilirsiniz.",
            );
            setAlertVariant("success");
          } else if (unattendedDays > 5 && unattendedDays <= 7) {
            setMessage(
              unattendedDays +
                " gün devamsızlığınız var. Ödevi teslim ettiğiniz takdirde katılım sertifikası + bitirme sertifikası alabilirsiniz.",
            );
            setAlertVariant("warning");
          } else if (unattendedDays > 8) {
            setMessage(
              unattendedDays +
                " gün devamsızlığınız var. Ödevi teslim etseniz dahi belge alamazsınız.",
            );
            setAlertVariant("danger");
          }
        }
      })
      .catch((err: any) => {
        console.error(err);
        setLoading(false);
        setMessage("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
        setAlertVariant("danger");
      });
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
