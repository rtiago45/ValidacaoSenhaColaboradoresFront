import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColaboradorService } from './services/colaborador.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  loginForm: FormGroup;
  senhaForca: number | undefined;
  colaboradores: any[] = [];
  mensagem: string = '';

  constructor(
    private fb: FormBuilder,
    private colaboradorService: ColaboradorService
  ) {
    this.loginForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(4)]],
      senha: ['', [Validators.required, Validators.minLength(4)]],
      cargo: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.carregarColaboradores();
  }

  carregarColaboradores() {
    this.colaboradorService.getAllColaboradores().subscribe(
      (response: any) => {
        this.colaboradores = response;
        this.calcularForcaSenha();
      },
      (error: any) => {
        console.error('Erro ao carregar colaboradores:', error);
      }
    );
  }

  get userName() {
    return this.loginForm.get('nome');
  }

  get password() {
    return this.loginForm.get('senha');
  }

  onSubmit() {
    this.mensagem = 'Formulário enviado com sucesso!';

    setTimeout(() => {
      this.mensagem = '';
    }, 3000);
    if (this.loginForm.valid) {
      const { nome, senha, cargo } = this.loginForm.value;
      this.colaboradorService.createColaborador({ nome, senha, cargo }).subscribe(
        (response: any) => {
          console.log('Colaborador criado com sucesso:', response);
          this.carregarColaboradores();
        },
        (error: any) => {
          console.error('Erro ao criar colaborador:', error);
        }
      );
    } else {
      console.log('Formulário inválido');
    }
    this.loginForm.reset();
  }

  calcularForcaSenha() {
      for (let colaborador of this.colaboradores) {
        const { senha, nome, cargo, forcaSenha } = colaborador;
              const pontuacao: number = forcaSenha;
              colaborador.senhaForca = this.obterNivelForcaSenha(pontuacao);
        }
    }



  obterNivelForcaSenha(pontuacao: number): string {
    if (pontuacao >= 110) {
      return "FORTE";
    }
    if (pontuacao >= 90) {
      return "BOA";
    }
    if (pontuacao >= 65) {
      return "MEDIANA";
    }
    return "RUIM";

  }

}
