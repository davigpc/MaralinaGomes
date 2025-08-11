package com.MaralinaGomes.ControleEstoque.Repository;

import com.MaralinaGomes.ControleEstoque.Model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    // Métodos de busca customizados podem ser adicionados aqui no futuro
}