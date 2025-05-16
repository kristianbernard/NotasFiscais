import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Container, Row, Col, Nav, Form, Button, Alert, Spinner } from "react-bootstrap";

const Upload = () => {
  const location = useLocation();

  const menuItems = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/upload", label: "Upload CSV" },
    { to: "/relatorio", label: "Relatórios" },
    { to: "/alertas", label: "Alertas" },
    { to: "/estatisticas", label: "Estatísticas" },
    { to: "/insight", label: "Gerar Insight com IA" },
  ];

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setMessage({ type: "error", text: "Selecione um arquivo antes de enviar." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Ajuste a URL para seu endpoint real
      const response = await fetch("http://localhost:5133/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao enviar arquivo");
      }

      setMessage({ type: "success", text: "Arquivo enviado com sucesso!" });
      setFile(null);
      (document.getElementById("formFile") as HTMLInputElement).value = ""; // reset input
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Erro inesperado" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid>
      <Row>
        {/* Menu lateral */}
        <Col
          xs={12}
          md={3}
          lg={2}
          className="bg-light vh-100 p-3 border-end"
          style={{ position: "sticky", top: 0 }}
        >
          <Nav className="flex-column">
            {menuItems.map((item) => (
              <Nav.Link
                as={Link}
                to={item.to}
                key={item.to}
                active={location.pathname === item.to}
                className={location.pathname === item.to ? "fw-bold" : ""}
              >
                {item.label}
              </Nav.Link>
            ))}
          </Nav>
        </Col>

        {/* Conteúdo principal */}
        <Col xs={12} md={9} lg={10} className="p-4 bg-white">
          <h2 className="mb-4">Upload de CSV</h2>

          {message && (
            <Alert variant={message.type === "success" ? "success" : "danger"}>{message.text}</Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Selecione o arquivo CSV</Form.Label>
              <Form.Control type="file" accept=".csv" onChange={handleFileChange} />
            </Form.Group>

            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Enviando...
                </>
              ) : (
                "Enviar"
              )}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Upload;
