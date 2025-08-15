package com.MaralinaGomes.ControleEstoque.Controller;

import com.MaralinaGomes.ControleEstoque.Model.MovimentoEstoque;
import com.MaralinaGomes.ControleEstoque.Model.Produto;
import com.MaralinaGomes.ControleEstoque.Repository.MovimentoEstoqueRepository;
import com.MaralinaGomes.ControleEstoque.Repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/movimentos")
public class MovimentoController {

    @Autowired
    private MovimentoEstoqueRepository movimentoRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @PostMapping
    @Transactional
    public ResponseEntity<MovimentoEstoque> registrarMovimento(@RequestBody MovimentoRequest request) {
        Produto produto = produtoRepository.findById(request.getProdutoId())
                .orElseThrow(() -> new RuntimeException("Produto não encontrado!"));

        if (request.getTipo() == MovimentoEstoque.TipoMovimento.ENTRADA) {
            produto.setQuantidade(produto.getQuantidade() + request.getQuantidade());
        } else {
            if (produto.getQuantidade() < request.getQuantidade()) {
                // Retorna um erro claro se tentar dar saída em mais do que tem
                return ResponseEntity.status(400).body(null);
            }
            produto.setQuantidade(produto.getQuantidade() - request.getQuantidade());
        }
        produtoRepository.save(produto);

        MovimentoEstoque movimento = new MovimentoEstoque();
        movimento.setProduto(produto);
        movimento.setTipo(request.getTipo());
        movimento.setQuantidade(request.getQuantidade());
        movimento.setDataMovimento(LocalDateTime.now());
        movimentoRepository.save(movimento);

        return ResponseEntity.ok(movimento);
    }

    @GetMapping
    public List<Produto> listarTodos(@RequestParam(required = false) String termo) {
        // Se um termo de busca for fornecido, usa o novo método de pesquisa.
        if (termo != null && !termo.isEmpty()) {
            return produtoRepository.searchAtivos(termo);
        }
        // Caso contrário, retorna todos os produtos ativos.
        return produtoRepository.findByAtivoTrue();
    }

    @GetMapping("/inativos")
    public List<Produto> listarInativos() {
        return produtoRepository.findByAtivoFalse();
    }

    @PutMapping("/{id}/reativar")
    public ResponseEntity<Void> reativarProduto(@PathVariable Long id) {
        return produtoRepository.findById(id).map(produto -> {
            produto.setAtivo(true); // Altera o status para ativo
            produtoRepository.save(produto);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/produto/{idProduto}")
    public ResponseEntity<List<MovimentoEstoque>> listarMovimentosPorProduto(@PathVariable Long idProduto) {
        // Verifica se o produto existe
        if (!produtoRepository.existsById(idProduto)) {
            return ResponseEntity.notFound().build();
        }

        // Busca os movimentos ordenados pela data
        List<MovimentoEstoque> movimentos = movimentoRepository.findByProdutoIdOrderByDataMovimentoDesc(idProduto);
        return ResponseEntity.ok(movimentos);
}

}

// Classe auxiliar
@lombok.Data
class MovimentoRequest {
    private Long produtoId;
    private MovimentoEstoque.TipoMovimento tipo;
    private int quantidade;
}
