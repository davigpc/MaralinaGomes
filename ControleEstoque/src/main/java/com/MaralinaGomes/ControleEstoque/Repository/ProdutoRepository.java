package com.MaralinaGomes.ControleEstoque.Repository;// Em src/main/java/com/MaralinaGomes/ControleEstoque/Repository/ProdutoRepository.java

import com.MaralinaGomes.ControleEstoque.Model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // Adicione este import
import org.springframework.data.repository.query.Param; // Adicione este import
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    List<Produto> findByAtivoTrue();
    List<Produto> findByAtivoFalse();

    // NOVO MÉTODO: Busca produtos ativos onde o nome, cor ou tamanho contenham o termo de busca.
    @Query("SELECT p FROM Produto p WHERE p.ativo = true AND (" +
            "LOWER(p.nome) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
            "LOWER(p.cor) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
            "LOWER(p.tamanho) LIKE LOWER(CONCAT('%', :termo, '%')))")
    List<Produto> searchAtivos(@Param("termo") String termo);
}