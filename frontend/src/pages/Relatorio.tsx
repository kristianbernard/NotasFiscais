// src/pages/Relatorio.tsx
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Container, Row, Col, Nav, Form, Button, Table, Alert, Spinner } from "react-bootstrap";

type RelatorioItem = {
  cnpj: string;
  totalImpostos: number | null;
  mediaDiferenca: number | null;
};

export default function Relatorio() {
  const [dados, setDados] = useState<RelatorioItem[]>([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  const menuItems = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/upload", label: "Upload CSV" },
    { to: "/relatorio", label: "Relatórios" },
    { to: "/alertas", label: "Alertas" },
    { to: "/estatisticas", label: "Estatísticas" },
    { to: "/insight", label: "Gerar Insight com IA" },
  ];

  const fetchDados = (cnpj?: string) => {
    setLoading(true);
    setError(null);

    let url = "http://localhost:5133/relatorio";
    if (cnpj) url += `?cnpj=${encodeURIComponent(cnpj)}`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao carregar relatório");
        return res.json();
      })
      .then((data) => {
        setDados(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDados(); // carrega tudo na abertura da página
  }, []);

  const handleFiltro = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDados(filtro);
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
          <h1 className="mb-4">Relatório com Filtros</h1>

          <Form className="mb-4" onSubmit={handleFiltro}>
            <Row className="align-items-center g-2">
              <Col xs={12} sm={8} md={6} lg={4}>
                <Form.Control
                  placeholder="Filtrar por CNPJ"
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                />
              </Col>
              <Col xs="auto">
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Filtrando...
                    </>
                  ) : (
                    "Filtrar"
                  )}
                </Button>
              </Col>
            </Row>
          </Form>

          {error && <Alert variant="danger">{error}</Alert>}

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>CNPJ</th>
                <th>Total Impostos</th>
                <th>Média Diferença</th>
              </tr>
            </thead>
            <tbody>
              {dados.length === 0 && !loading && (
                <tr>
                  <td colSpan={3} className="text-center">
                    Nenhum dado encontrado.
                  </td>
                </tr>
              )}
              {dados.map((item, index) => (
                <tr key={index}>
                  <td>{item.cnpj}</td>
                  <td>{item.totalImpostos != null ? item.totalImpostos.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "R$ 0,00"}</td>
                  <td>{item.mediaDiferenca != null ? item.mediaDiferenca.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "R$ 0,00"}</td>

                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}
