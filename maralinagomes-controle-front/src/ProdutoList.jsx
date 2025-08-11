import React, { useState, useEffect } from 'react';

function ProdutoList() {
    const [produtos, setProdutos] = useState([]);

    useEffect(() => {
        // A URL da sua API backend
        fetch('http://localhost:8080/api/produtos')
            .then(response => response.json())
            .then(data => setProdutos(data))
            .catch(error => console.error("Erro ao buscar produtos:", error));
    }, []); // O array vazio faz com que rode apenas uma vez

    return (
        <div>
            <h1>Lista de Produtos</h1>
            <ul>
                {produtos.map(produto => (
                    <li key={produto.id}>
                        {produto.nome} - Cor: {produto.cor}, Tam: {produto.tamanho}, Qtd: {produto.quantidade}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ProdutoList;