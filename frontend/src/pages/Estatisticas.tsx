import React, { useEffect, useState } from "react";
import { Container, Row, Col, Nav, Card, Spinner, Alert } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

interface EstatisticaGeral {
  totalNotas: number;
  totalItens: number;
  valorTotal: number;
  impostoTotal: number;
  mediaImpostoItem: number;
}

const Estatisticas = () => {
  const location = useLocation();
  const [data, setData] = useState<EstatisticaGeral | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    const fetchEstatisticas = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:5133/estatisticas", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Erro ${res.status}: ${text || res.statusText}`);
        }
        const dados = await res.json();
        setData(dados);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEstatisticas();
  }, []);

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

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
          <h2 className="mb-4">Estatísticas Gerais</h2>

          {loading && (
            <div className="text-center my-4">
              <Spinner animation="border" />
            </div>
          )}

          {error && <Alert variant="danger">{error}</Alert>}

          {!loading && !error && data && (
            <Row className="g-3">
              <Col md={4}>
                <Card className="p-3 text-center">
                  <h5>Total de Notas</h5>
                  <p>{data.totalNotas.toLocaleString()}</p>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="p-3 text-center">
                  <h5>Total de Itens</h5>
                  <p>{data.totalItens.toLocaleString()}</p>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="p-3 text-center">
                  <h5>Valor Total</h5>
                  <p>{formatCurrency(data.valorTotal)}</p>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="p-3 text-center">
                  <h5>Imposto Total</h5>
                  <p>{formatCurrency(data.impostoTotal)}</p>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="p-3 text-center">
                  <h5>Média Imposto por Item</h5>
                  <p>{formatCurrency(data.mediaImpostoItem)}</p>
                </Card>
              </Col>
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Estatisticas;
