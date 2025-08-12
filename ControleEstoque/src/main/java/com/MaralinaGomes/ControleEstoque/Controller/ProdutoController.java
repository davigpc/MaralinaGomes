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

    // Endpoint principal para buscar produtos (ativos ou com pesquisa)
    @GetMapping
    public List<Produto> listarTodos(@RequestParam(required = false) String termo) {
        if (termo != null && !termo.isEmpty()) {
            return produtoRepository.searchAtivos(termo);
        }
        return produtoRepository.findByAtivoTrue();
    }

    // ++ NOVO ENDPOINT ADICIONADO ++
    // Endpoint para buscar apenas os produtos inativos
    @GetMapping("/inativos")
    public List<Produto> listarInativos() {
        return produtoRepository.findByAtivoFalse();
    }

    // Endpoint para criar um novo produto
    @PostMapping
    public Produto criarProduto(@RequestBody Produto produto) {
        return produtoRepository.save(produto);
    }

    // Endpoint para inativar (soft delete) um produto
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> inativarProduto(@PathVariable Long id) {
        return produtoRepository.findById(id).map(produto -> {
            produto.setAtivo(false);
            produtoRepository.save(produto);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // ++ NOVO ENDPOINT ADICIONADO ++
    // Endpoint para reativar um produto
    @PutMapping("/{id}/reativar")
    public ResponseEntity<Void> reativarProduto(@PathVariable Long id) {
        return produtoRepository.findById(id).map(produto -> {
            produto.setAtivo(true);
            produtoRepository.save(produto);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}