// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Container, Row, Col, Nav } from "react-bootstrap";

type Resumo = {
  totalNotas: number;
  totalItens: number;
  impostoTotal: number;
  valorTotal: number;
};

export default function Dashboard() {
  const [resumo, setResumo] = useState<Resumo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    fetch("http://localhost:5133/estatisticas")
      .then((res) => {
        if (!res.ok) throw new Error("Falha ao carregar estatísticas");
        return res.json();
      })
      .then((data) => {
        setResumo(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  const menuItems = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/upload", label: "Upload CSV" },
    { to: "/relatorio", label: "Relatórios" },
    { to: "/alertas", label: "Alertas" },
    { to: "/estatisticas", label: "Estatísticas" },
    { to: "/insight", label: "Gerar Insight com IA" },
  ];

  // Função pra formatar moeda no padrão BR
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (loading) return <p className="text-center mt-5">Carregando...</p>;
  if (error) return <p className="text-center mt-5 text-danger">Erro: {error}</p>;

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
          <h1 className="mb-4">Dashboard</h1>
          <Row className="g-3">
            <Col sm={6} md={3}>
              <div className="p-3 border rounded text-center shadow-sm">
                <h5>Total de Notas</h5>
                <p className="fs-4">{resumo?.totalNotas}</p>
              </div>
            </Col>
            <Col sm={6} md={3}>
              <div className="p-3 border rounded text-center shadow-sm">
                <h5>Total de Itens</h5>
                <p className="fs-4">{resumo?.totalItens}</p>
              </div>
            </Col>
            <Col sm={6} md={3}>
              <div className="p-3 border rounded text-center shadow-sm">
                <h5>Imposto Total</h5>
                <p className="fs-4">{formatCurrency(resumo?.impostoTotal ?? 0)}</p>
              </div>
            </Col>
            <Col sm={6} md={3}>
              <div className="p-3 border rounded text-center shadow-sm">
                <h5>Valor Total</h5>
                <p className="fs-4">{formatCurrency(resumo?.valorTotal ?? 0)}</p>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
