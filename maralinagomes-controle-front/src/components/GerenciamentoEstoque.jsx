import React, { useState, useEffect, useMemo } from 'react';
import '../Estilo.css';

// --- Componente do Modal de Histórico ---
const ModalHistorico = ({ produtoId, onClose }) => {
    const [movimentos, setMovimentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (produtoId) {
            fetch(`/api/movimentos/produto/${produtoId}`)
                .then(res => {
                    if (!res.ok) throw new Error("Falha ao buscar movimentos");
                    return res.json();
                })
                .then(data => setMovimentos(data))
                .catch(err => setError(err.message))
                .finally(() => setLoading(false));
        }
    }, [produtoId]);

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>Histórico de Movimentação</h2>
                {loading && <p>Carregando...</p>}
                {error && <p className="error-message">{error}</p>}
                {!loading && !error && (
                    <table>
                        <thead>
                        <tr>
                            <th>Data</th>
                            <th>Tipo</th>
                            <th>Quantidade</th>
                        </tr>
                        </thead>
                        <tbody>
                        {movimentos.map(m => (
                            <tr key={m.id}>
                                <td>{new Date(m.dataMovimento).toLocaleString('pt-BR')}</td>
                                <td className={m.tipo === 'ENTRADA' ? 'tipo-entrada' : 'tipo-saida'}>{m.tipo}</td>
                                <td>{m.quantidade}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
                <button onClick={onClose}>Fechar</button>
            </div>
        </div>
    );
};

// --- Componente do Modal de Movimentação (Entrada/Saída) ---
const ModalMovimento = ({ produto, tipo, onClose, onSave }) => {
    const [quantidade, setQuantidade] = useState(1);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(produto.id, parseInt(quantidade), tipo);
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>Registrar {tipo === 'ENTRADA' ? 'Entrada' : 'Saída'} de Estoque</h2>
                <p><strong>Produto:</strong> {produto.nome} ({produto.cor}, {produto.tamanho})</p>
                <form onSubmit={handleSubmit} className="form-modal">
                    <label htmlFor="quantidade">Quantidade:</label>
                    <input
                        id="quantidade"
                        type="number"
                        value={quantidade}
                        onChange={(e) => setQuantidade(e.target.value)}
                        min="1"
                        required
                        autoFocus
                    />
                    <button type="submit">Salvar Movimentação</button>
                    <button type="button" className="cancel-btn" onClick={onClose}>Cancelar</button>
                </form>
            </div>
        </div>
    );
};


// --- Componente Principal ---
function GerenciamentoEstoque() {
    const [produtos, setProdutos] = useState([]);
    const [produto, setProduto] = useState({ nome: '', cor: '', tamanho: '', preco: ''});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalHistorico, setModalHistorico] = useState({ aberto: false, id: null });
    const [modalMovimento, setModalMovimento] = useState({ aberto: false, produto: null, tipo: '' });
    const [termoBusca, setTermoBusca] = useState('');
    const [exibindo, setExibindo] = useState('ativos'); // Controla a visualização: 'ativos' ou 'inativos'

    const fetchProdutos = async () => {
        setLoading(true);
        const url = exibindo === 'ativos' ? '/api/produtos' : '/api/produtos/inativos';
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Falha na resposta da rede');
            const data = await response.json();
            setProdutos(data);
        } catch (error) {
            setError('Não foi possível carregar os produtos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProdutos();
    }, [exibindo]);

    const produtosFiltrados = useMemo(() => {
        if (!termoBusca) {
            return produtos;
        }
        return produtos.filter(p =>
            p.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
            p.cor.toLowerCase().includes(termoBusca.toLowerCase()) ||
            p.tamanho.toLowerCase().includes(termoBusca.toLowerCase())
        );
    }, [produtos, termoBusca]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setProduto({ ...produto, [name]: value });
    };

    const handleCriarProduto = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('/api/produtos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...produto, quantidade: 0, ativo: true }),
            });
            if (!response.ok) throw new Error("Falha ao cadastrar produto.");
            alert('Novo produto cadastrado no catálogo!');
            resetarFormulario();
            fetchProdutos();
        } catch (error) {
            setError(error.message);
        }
    };

    const handleInativar = async (id) => {
        if (window.confirm('Tem certeza que deseja inativar este produto? Ele não aparecerá mais na lista.')) {
            try {
                await fetch(`/api/produtos/${id}`, { method: 'DELETE' });
                fetchProdutos();
            } catch (error) {
                setError("Falha ao inativar produto.");
            }
        }
    };

    const handleReativar = async (id) => {
        if (window.confirm('Tem certeza que deseja reativar este produto?')) {
            try {
                await fetch(`/api/produtos/${id}/reativar`, { method: 'PUT' });
                alert('Produto reativado com sucesso!');
                fetchProdutos();
            } catch (error) {
                setError("Falha ao reativar produto.");
            }
        }
    };

    const handleSalvarMovimento = async (produtoId, quantidade, tipo) => {
        try {
            const response = await fetch('/api/movimentos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ produtoId, quantidade, tipo }),
            });
            if (!response.ok) throw new Error('Não há stock suficiente para esta saída.');
            alert(`Movimentação de ${tipo.toLowerCase()} registrada!`);
            setModalMovimento({ aberto: false, produto: null, tipo: '' });
            fetchProdutos();
        } catch (error) {
            alert(error.message);
        }
    };

    const resetarFormulario = () => {
        setProduto({ nome: '', cor: '', tamanho: '', preco: '' });
    };

    if (loading) return <div>Carregando...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="container">
            <div className="logo-container">
                <div className="logo-placeholder">MG</div>
            </div>

            <h1>Gerenciamento de Estoque</h1>

            {exibindo === 'ativos' && (
                <div className="form-container">
                    <h2>Cadastrar Novo Produto no Catálogo</h2>
                    <form onSubmit={handleCriarProduto}>
                        <input type="text" name="nome" value={produto.nome} onChange={handleInputChange} placeholder="Nome do Produto" required />
                        <input type="text" name="cor" value={produto.cor} onChange={handleInputChange} placeholder="Cor" required />
                        <input type="text" name="tamanho" value={produto.tamanho} onChange={handleInputChange} placeholder="Tamanho" required />
                        <input type="number" name="preco" value={produto.preco} onChange={handleInputChange} placeholder="Preço (R$)" step="0.01" required />
                        <button type="submit">Cadastrar Produto</button>
                    </form>
                </div>
            )}

            <div className="table-container">
                <div className="table-header">
                    <h2>Lista de Estoque ({exibindo === 'ativos' ? 'Ativos' : 'Inativos'})</h2>
                    <button className="toggle-view-btn" onClick={() => setExibindo(exibindo === 'ativos' ? 'inativos' : 'ativos')}>
                        Ver Produtos {exibindo === 'ativos' ? 'Inativos' : 'Ativos'}
                    </button>
                </div>

                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Pesquisar por nome, cor ou tamanho..."
                        value={termoBusca}
                        onChange={(e) => setTermoBusca(e.target.value)}
                    />
                </div>

                <table>
                    <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Cor / Tamanho</th>
                        <th>Preço</th>
                        <th>Qtd. Atual</th>
                        <th style={{ textAlign: 'center' }}>Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {produtosFiltrados.map(p => (
                        <tr key={p.id}>
                            <td>{p.nome}</td>
                            <td>{p.cor} / {p.tamanho}</td>
                            <td>R$ {p.preco ? parseFloat(p.preco).toFixed(2) : '0.00'}</td>
                            <td>{p.quantidade}</td>
                            <td className="acoes">
                                {exibindo === 'ativos' ? (
                                    <>
                                        <button className="entrada-btn" onClick={() => setModalMovimento({ aberto: true, produto: p, tipo: 'ENTRADA' })}>+ Entrada</button>
                                        <button className="saida-btn" onClick={() => setModalMovimento({ aberto: true, produto: p, tipo: 'SAIDA' })}>- Saída</button>
                                        <button className="history-btn" onClick={() => setModalHistorico({ aberto: true, id: p.id })}>Histórico</button>
                                        <button className="delete-btn" onClick={() => handleInativar(p.id)}>Inativar</button>
                                    </>
                                ) : (
                                    <>
                                        <button className="history-btn" onClick={() => setModalHistorico({ aberto: true, id: p.id })}>Histórico</button>
                                        <button className="reactivate-btn" onClick={() => handleReativar(p.id)}>Reativar</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {modalHistorico.aberto && <ModalHistorico produtoId={modalHistorico.id} onClose={() => setModalHistorico({ aberto: false, id: null })} />}
            {modalMovimento.aberto && <ModalMovimento produto={modalMovimento.produto} tipo={modalMovimento.tipo} onClose={() => setModalMovimento({ aberto: false, produto: null, tipo: '' })} onSave={handleSalvarMovimento} />}
        </div>
    );
}

export default GerenciamentoEstoque;