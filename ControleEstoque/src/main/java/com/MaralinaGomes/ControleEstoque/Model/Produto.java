package com.MaralinaGomes.ControleEstoque.Model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "produtos")
@Data // Lombok para gerar getters, setters, etc.
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String cor;
    private String tamanho;
    private double preco;
    private int quantidade;

    @Column(nullable = false)
    private boolean ativo = true;
}