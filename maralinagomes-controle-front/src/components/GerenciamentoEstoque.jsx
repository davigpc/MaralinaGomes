import React, { useState, useEffect } from 'react';
import '../Estilo.css'; // Vamos criar este arquivo de estilo a seguir

function GerenciamentoEstoque() {
    // Endereço da sua API. Usar variável de ambiente é a melhor prática.
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/produtos';

    // Estados do componente
    const [produtos, setProdutos] = useState([]);
    const [produto, setProduto] = useState({ nome: '', cor: '', tamanho: '', preco: '', quantidade: '' });
    const [editandoId, setEditandoId] = useState(null); // Controla se estamos adicionando ou editando
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect para buscar os produtos da API quando o componente é montado
    useEffect(() => {
        fetchProdutos();
    }, []);

    const fetchProdutos = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('Falha na resposta da rede');
            }
            const data = await response.json();
            setProdutos(data);
        } catch (error) {
            setError('Não foi possível carregar os produtos. Verifique se a API está rodando.');
        } finally {
            setLoading(false);
        }
    };

    // Lida com a mudança nos campos do formulário
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setProduto({ ...produto, [name]: value });
    };

    // Lida com o envio do formulário (criação ou atualização)
    const handleSubmit = async (event) => {
        event.preventDefault();

        const metodo = editandoId ? 'PUT' : 'POST';
        const url = editandoId ? `${API_URL}/${editandoId}` : API_URL;

        try {
            const response = await fetch(url, {
                method: metodo,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(produto),
            });

            if (!response.ok) {
                throw new Error('Falha ao salvar o produto.');
            }

            alert(`Produto ${editandoId ? 'atualizado' : 'adicionado'} com sucesso!`);
            resetarFormulario();
            fetchProdutos(); // Atualiza a lista

        } catch (error) {
            setError(error.message);
        }
    };

    // Prepara o formulário para edição
    const handleEditar = (prod) => {
        setEditandoId(prod.id);
        setProduto(prod);
    };

    // Lida com a exclusão de um produto
    const handleExcluir = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este produto?')) {
            try {
                const response = await fetch(`${API_URL}/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error('Falha ao excluir o produto.');
                }
                alert('Produto excluído com sucesso!');
                fetchProdutos(); // Atualiza a lista
            } catch (error) {
                setError(error.message);
            }
        }
    };

    // Limpa o formulário e o estado de edição
    const resetarFormulario = () => {
        setEditandoId(null);
        setProduto({ nome: '', cor: '', tamanho: '', preco: '', quantidade: '' });
    };


    if (loading) return <div>Carregando...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="container">
            <h1>Gerenciamento de Estoque</h1>

            <div className="form-container">
                <h2>{editandoId ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="nome" value={produto.nome} onChange={handleInputChange} placeholder="Nome do Produto" required />
                    <input type="text" name="cor" value={produto.cor} onChange={handleInputChange} placeholder="Cor" required />
                    <input type="text" name="tamanho" value={produto.tamanho} onChange={handleInputChange} placeholder="Tamanho" required />
                    <input type="number" name="preco" value={produto.preco} onChange={handleInputChange} placeholder="Preço (R$)" step="0.01" required />
                    <input type="number" name="quantidade" value={produto.quantidade} onChange={handleInputChange} placeholder="Quantidade" required />
                    <button type="submit">{editandoId ? 'Atualizar' : 'Adicionar'}</button>
                    {editandoId && <button type="button" className="cancel-btn" onClick={resetarFormulario}>Cancelar Edição</button>}
                </form>
            </div>

            <div className="table-container">
                <h2>Lista de Estoque</h2>
                <table>
                    <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Cor</th>
                        <th>Tamanho</th>
                        <th>Preço</th>
                        <th>Qtd.</th>
                        <th>Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {produtos.map(p => (
                        <tr key={p.id}>
                            <td>{p.nome}</td>
                            <td>{p.cor}</td>
                            <td>{p.tamanho}</td>
                            <td>R$ {parseFloat(p.preco).toFixed(2)}</td>
                            <td>{p.quantidade}</td>
                            <td>
                                <button className="edit-btn" onClick={() => handleEditar(p)}>Editar</button>
                                <button className="delete-btn" onClick={() => handleExcluir(p.id)}>Excluir</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default GerenciamentoEstoque;