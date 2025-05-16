import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Nav,
  Table,
  Alert,
  Spinner,
  Form,
} from "react-bootstrap";

interface AlertaItem {
  cnpj: string;
  numeroNota: string;
  valorTotal: number | null;
  impostoTotal: number | null;
  diferenca: number | null;
}

const Alertas = () => {
  const [alertas, setAlertas] = useState<AlertaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const location = useLocation();
  const token = localStorage.getItem("token") || "";

  const fetchAlertas = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5133/alertas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Erro ${res.status}: ${text || res.statusText}`);
      }
      const data = await res.json();
      const parsed = data.map((item: any) => ({
        cnpj: item.cnpj ?? "",
        numeroNota: item.numero_nota ?? "",
        valorTotal: item.valorTotal ?? null,
        impostoTotal: item.impostoTotal ?? null,
        diferenca: item.diferenca ?? null,
      }));
      setAlertas(parsed);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertas();
  }, []);

  const formatCurrency = (value: number | null) =>
    value !== null && value !== undefined
      ? value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
      : "-";

  const formatNumber = (value: number | null) =>
    value !== null && value !== undefined ? value.toFixed(2) : "-";

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const paginatedAlertas = alertas.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(alertas.length / rowsPerPage);

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
          <h2 className="mb-4">Notas com Diferença maior 50%</h2>

          {loading && (
            <div className="text-center my-4">
              <Spinner animation="border" />
            </div>
          )}

          {error && <Alert variant="danger">{error}</Alert>}

          {!loading && !error && (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Exibindo {rowsPerPage} por página</span>
                <Form.Select
                  style={{ width: "150px" }}
                  value={rowsPerPage}
                  onChange={handleRowsPerPageChange}
                >
                  <option value={20}>20 por página</option>
                  <option value={50}>50 por página</option>
                  <option value={100}>100 por página</option>
                </Form.Select>
              </div>

              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>CNPJ</th>
                    <th>Número da Nota</th>
                    <th>Valor Total</th>
                    <th>Imposto Total</th>
                    <th>Diferença</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAlertas.length > 0 ? (
                    paginatedAlertas.map((item, index) => (
                      <tr key={index}>
                        <td>{item.cnpj}</td>
                        <td>{item.numeroNota}</td>
                        <td>{formatCurrency(item.valorTotal)}</td>
                        <td>{formatCurrency(item.impostoTotal)}</td>
                        <td>{formatCurrency(item.diferenca)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center">
                        Nenhum alerta encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              <div className="d-flex justify-content-between align-items-center">
                <span>Página {currentPage} de {totalPages}</span>
                <div>
                  <button
                    className="btn btn-outline-primary me-2"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </button>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Próxima
                  </button>
                </div>
              </div>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Alertas;
