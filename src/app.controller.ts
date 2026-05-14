import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { PraticaDocument } from './schemas/pratica.schema';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('api/praticas')
  async criarPratica(
    @Body() praticaData: {
      nomeUsuario: string;
      tipo: string;
      data: Date;
      descricao?: string;
    },
  ): Promise<PraticaDocument> {
    return this.appService.criarPratica(praticaData);
  }

  @Get('api/praticas')
  async obterPraticas(): Promise<PraticaDocument[]> {
    return this.appService.obterTodasPraticas();
  }

  @Get('api/historico')
  async obterHistorico(
    @Query('nomeUsuario') nomeUsuario?: string,
    @Query('tipo') tipo?: string,
    @Query('dataInicial') dataInicial?: string,
    @Query('dataFinal') dataFinal?: string,
  ): Promise<PraticaDocument[]> {
    return this.appService.obterHistorico({
      nomeUsuario,
      tipo,
      dataInicial,
      dataFinal,
    });
  }

  @Get('api/estatisticas')
  async obterEstatisticas() {
    return this.appService.obterEstatisticas();
  }
}
