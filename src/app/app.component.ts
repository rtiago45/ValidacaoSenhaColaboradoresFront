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
      senha: ['', [Validators.required, Validators.minLength(8)]],
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
        // Após carregar os colaboradores, calcula a força da senha de cada um
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
          this.carregarColaboradores(); // Atualiza a lista de colaboradores após a criação
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
      const { senha, nome, cargo } = colaborador;
      this.colaboradorService.calcularForcaSenha(senha, nome, cargo).subscribe(
        (response: any) => {
          if (response && response.nivelForcaSenha) {
            console.log();

            colaborador.senhaForca = response.nivelForcaSenha;
          } else {
            console.error('Resposta inválida do serviço de força de senha');
            colaborador.senhaForca = 'Desconhecido';
          }
        },
        (error: any) => {
          console.error('Erro ao calcular a força da senha:', error);
          colaborador.senhaForca = 'Erro';
        }
      );
    }
  }


}
