import React, { useState } from "react";
import { Container, Row, Col, Nav, Form, Button, Spinner, Alert, Card } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const Insight = () => {
  const location = useLocation();
  const [pergunta, setPergunta] = useState("");
  const [resposta, setResposta] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token") || "";

  const handleEnviar = async () => {
    setLoading(true);
    setError(null);
    setResposta(null);

    try {
      const res = await fetch("http://localhost:5133/interpretar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // Mesmo que backend não use essa pergunta, envio para o caso de evoluir.
        body: JSON.stringify({ pergunta }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Erro ${res.status}: ${text || res.statusText}`);
      }

      const data = await res.json();
      setResposta(data.Interpretacao || "Sem resposta da IA");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col
          xs={12}
          md={3}
          lg={2}
          className="bg-light vh-100 p-3 border-end"
          style={{ position: "sticky", top: 0 }}
        >
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/dashboard" active={location.pathname === "/dashboard"}>
              Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/upload" active={location.pathname === "/upload"}>
              Upload CSV
            </Nav.Link>
            <Nav.Link as={Link} to="/relatorio" active={location.pathname === "/relatorio"}>
              Relatórios
            </Nav.Link>
            <Nav.Link as={Link} to="/alertas" active={location.pathname === "/alertas"}>
              Alertas
            </Nav.Link>
            <Nav.Link as={Link} to="/estatisticas" active={location.pathname === "/estatisticas"}>
              Estatísticas
            </Nav.Link>
            <Nav.Link as={Link} to="/insight" active={location.pathname === "/insight"}>
              Gerar Insight com IA
            </Nav.Link>
          </Nav>
        </Col>

        <Col xs={12} md={9} lg={10} className="p-4 bg-white">
          <h2 className="mb-4">Insight com IA</h2>

          <Form.Group controlId="pergunta" className="mb-3">
            <Form.Label>Faça sua pergunta sobre os dados fiscais</Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite sua pergunta aqui..."
              value={pergunta}
              onChange={(e) => setPergunta(e.target.value)}
              disabled={loading}
            />
          </Form.Group>

          <Button onClick={handleEnviar} disabled={loading || pergunta.trim() === ""}>
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />{" "}
                Enviando...
              </>
            ) : (
              "Gerar Insight"
            )}
          </Button>

          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

          {resposta && (
            <Card className="mt-4 p-3" style={{ whiteSpace: "pre-wrap" }}>
              <h5>Resposta da IA:</h5>
              <div>{resposta}</div>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Insight;
