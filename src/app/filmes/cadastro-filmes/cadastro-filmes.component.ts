import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { FilmesService } from 'src/app/core/filmes.service';
import { AlertaComponent } from 'src/app/shared/components/alerta/alerta.component';
import { ValidarCamposService } from 'src/app/shared/components/campos/validar-campos.service';
import { Alerta } from 'src/app/shared/models/alerta';
import { Filme } from 'src/app/shared/models/filme';

@Component({
  selector: 'dio-cadastro-filmes',
  templateUrl: './cadastro-filmes.component.html',
  styleUrls: ['./cadastro-filmes.component.scss']
})
export class CadastroFilmesComponent implements OnInit {

  id: number;
  cadastro: FormGroup;
  generos: Array<string>;

  constructor(public validacao: ValidarCamposService,
              public dialog: MatDialog,
              private fb: FormBuilder,
              private filmeService: FilmesService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  get f(){
    return this.cadastro.controls;
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id']; //Recupera o ID passado por parâmetro
    if(this.id) {
      this.filmeService.visualizar(this.id)
          .subscribe((filme: Filme) => this.criarFormulario(filme));
    }else{
      this.criarFormulario(this.criarFilmeEmBranco());
    }

    this.generos = ['Ação', 'Drama', 'Terror', 'Romance', 'Aventura', 'Ficção Científica'];

  }

  submit(): void{
    this.cadastro.markAllAsTouched(); //Ao salvar, marca todos os campos (exibindo assim os erros)
    if (this.cadastro.invalid){
      return;
    }

    //alert('Sucesso!\n\n' + JSON.stringify(this.cadastro.value, null, 4));
    const filme = this.cadastro.getRawValue() as Filme; //getRawValue() = recupera os valores dos campos
    if (this.id) {
      filme.id = this.id;
      this.editar(filme);
    }else{
      this.salvar(filme);
    }

  }

  reiniciarForm(): void{
    this.cadastro.reset();
  }

  private criarFormulario(filme: Filme): void{
    this.cadastro = this.fb.group({
      titulo: [filme.titulo, [Validators.required, Validators.minLength(2), Validators.maxLength(256)]],
      urlFoto: [filme.urlFoto, [Validators.minLength(10)]],
      dtLancamento: [filme.dtLancamento, [Validators.required]],
      descricao: [filme.descricao],
      nota: [filme.nota, [Validators.required, Validators.min(0), Validators.max(10)]],
      urlIMDb: [filme.urlIMDb, [Validators.minLength(10)]],
      genero: [filme.genero, [Validators.required]]
    });
  }

  private criarFilmeEmBranco(): Filme {
    return{
      id: null,
      titulo: null,
      urlFoto: null,
      dtLancamento: null,
      descricao: null,
      nota: null,
      urlIMDb: null,
      genero: null
    } as Filme;
  }

  private salvar(filme: Filme): void{
    this.filmeService.salvar(filme).subscribe(() => {
      const config = {
        data: {
          btnSucesso: 'Ir Para a Listagem',
          btnCancelar: 'Cadastrar um Novo Filme',
          corBtnCancelar: 'primary',
          possuirBtnFechar: true
        } as Alerta
      };
      const dialogRef = this.dialog.open(AlertaComponent, config); //Exibi a caixa de diálogo
      dialogRef.afterClosed().subscribe((opcao: boolean) => { //Tratamento do retorno da caixa de diálogo
        if(opcao){
          this.router.navigateByUrl('filmes');
        }else{
          this.reiniciarForm();
        }
      });
    },
    () => {
      const config = {
        data: {
          titulo: 'Erro ao Salvar o Registro!',
          descricao: 'Não Conseguimos Salvar seu Registro, Favor Tente mais Tarde.',
          corBtnSucesso: 'warn',
          btnSucesso: 'Fechar'
        } as Alerta
      };
      this.dialog.open(AlertaComponent, config);
    });
  }

  private editar(filme: Filme): void{
    this.filmeService.editar(filme).subscribe(() => {
      const config = {
        data: {
          descricao: 'Seu Registro foi Atualizado com Sucesso!',
          btnSucesso: 'Ir Para a Listagem'
        } as Alerta
      };
      const dialogRef = this.dialog.open(AlertaComponent, config); //Exibi a caixa de diálogo
      dialogRef.afterClosed().subscribe(() => this.router.navigateByUrl('filmes'));
    },
    () => {
      const config = {
        data: {
          titulo: 'Erro ao Salvar o Registro!',
          descricao: 'Não Conseguimos Editar seu Registro, Favor Tente mais Tarde.',
          corBtnSucesso: 'warn',
          btnSucesso: 'Fechar'
        } as Alerta
      };
      this.dialog.open(AlertaComponent, config);
    });
  }

}
