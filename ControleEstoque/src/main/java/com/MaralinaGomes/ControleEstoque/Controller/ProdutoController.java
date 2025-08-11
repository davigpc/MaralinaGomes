package com.MaralinaGomes.ControleEstoque.Controller;

import com.MaralinaGomes.ControleEstoque.Model.Produto;
import com.MaralinaGomes.ControleEstoque.Repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    @Autowired
    private ProdutoRepository produtoRepository;

    @GetMapping
    public List<Produto> listarTodos() {
        return produtoRepository.findAll();
    }

    @PostMapping
    public Produto criarProduto(@RequestBody Produto produto) {
        return produtoRepository.save(produto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirProduto(@PathVariable Long id) {
        // É uma boa prática verificar se o produto existe antes de tentar deletar
        if (!produtoRepository.existsById(id)) {
            // Se não existir, retorna um erro 404 Not Found, o que é mais correto
            return ResponseEntity.notFound().build();
        }

        // Se existir, deleta o produto pelo ID
        produtoRepository.deleteById(id);

        // Retorna uma resposta 200 OK sem conteúdo no corpo
        return ResponseEntity.ok().build();
    }
}
