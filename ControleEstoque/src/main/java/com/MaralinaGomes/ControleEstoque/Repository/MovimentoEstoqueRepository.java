package com.MaralinaGomes.ControleEstoque.Repository;

import com.MaralinaGomes.ControleEstoque.Model.MovimentoEstoque;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovimentoEstoqueRepository extends JpaRepository<MovimentoEstoque, Long> {
    // Método para buscar todos os movimentos de um produto específico, ordenado pela data
    List<MovimentoEstoque> findByProdutoIdOrderByDataMovimentoDesc(Long produtoId);
}