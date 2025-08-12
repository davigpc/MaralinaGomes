package com.MaralinaGomes.ControleEstoque.Model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "movimentos_estoque")
@Data
public class MovimentoEstoque {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne // Muitos movimentos podem estar associados a um produto
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;

    @Enumerated(EnumType.STRING) // Salva o tipo como texto (ENTRADA, SAIDA)
    private TipoMovimento tipo;

    private int quantidade;

    private LocalDateTime dataMovimento;

    public enum TipoMovimento {
        ENTRADA,
        SAIDA
    }
}