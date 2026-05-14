import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pratica, PraticaDocument } from './schemas/pratica.schema';

@Injectable()
export class AppService {
  constructor(@InjectModel(Pratica.name) private praticaModel: Model<PraticaDocument>) {}

  getHello(): string {
    return 'Hello World!';
  }

  private normalizeForSearch(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  async criarPratica(praticaData: {
    nomeUsuario: string;
    tipo: string;
    data: Date;
    descricao?: string;
  }): Promise<PraticaDocument> {
    const pratica = new this.praticaModel({
      ...praticaData,
      nomeUsuarioSearch: this.normalizeForSearch(praticaData.nomeUsuario),
      tipoSearch: this.normalizeForSearch(praticaData.tipo),
    });
    return pratica.save();
  }

  async obterTodasPraticas(): Promise<PraticaDocument[]> {
    return this.praticaModel.find().exec();
  }

  async obterHistorico(filtros: {
    nomeUsuario?: string;
    tipo?: string;
    dataInicial?: string;
    dataFinal?: string;
  }): Promise<PraticaDocument[]> {
    const query: any = {};

    if (filtros.nomeUsuario) {
      query.nomeUsuarioSearch = new RegExp(
        this.normalizeForSearch(filtros.nomeUsuario),
        'i',
      );
    }

    if (filtros.tipo) {
      query.tipoSearch = new RegExp(this.normalizeForSearch(filtros.tipo), 'i');
    }

    if (filtros.dataInicial || filtros.dataFinal) {
      query.data = {};
      if (filtros.dataInicial) {
        query.data.$gte = new Date(filtros.dataInicial);
      }
      if (filtros.dataFinal) {
        query.data.$lte = new Date(new Date(filtros.dataFinal).getTime() + 86399999); // Fim do dia
      }
    }

    return this.praticaModel.find(query).sort({ data: -1 }).exec();
  }

  async obterEstatisticas() {
    const todasPraticas = await this.praticaModel.find().exec();

    if (todasPraticas.length === 0) {
      return {
        totalPraticas: 0,
        tipoMaisRegistrado: null,
        usuarioMaisRegistros: null,
        totalPorTipo: {},
        mediaDiaria: 0,
      };
    }

    // Total geral
    const totalPraticas = todasPraticas.length;

    // Total por tipo
    const totalPorTipo: { [key: string]: number } = {};
    todasPraticas.forEach(pratica => {
      totalPorTipo[pratica.tipo] = (totalPorTipo[pratica.tipo] || 0) + 1;
    });

    // Tipo mais registrado
    let tipoMaisRegistrado = '';
    let maxTipo = 0;
    for (const [tipo, total] of Object.entries(totalPorTipo)) {
      if (total > maxTipo) {
        maxTipo = total;
        tipoMaisRegistrado = tipo;
      }
    }

    // Usuário com mais registros
    const totalPorUsuario: { [key: string]: number } = {};
    todasPraticas.forEach(pratica => {
      totalPorUsuario[pratica.nomeUsuario] =
        (totalPorUsuario[pratica.nomeUsuario] || 0) + 1;
    });

    let usuarioMaisRegistros = '';
    let maxUsuario = 0;
    for (const [usuario, total] of Object.entries(totalPorUsuario)) {
      if (total > maxUsuario) {
        maxUsuario = total;
        usuarioMaisRegistros = usuario;
      }
    }

    // Média diária (últimos 30 dias)
    const hoje = new Date();
    const trinta = new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000);

    const praticasUltimos30 = todasPraticas.filter(p => {
      const dataPratica = new Date(p.data);
      return dataPratica >= trinta && dataPratica <= hoje;
    });

    const mediaDiaria =
      praticasUltimos30.length > 0 ? praticasUltimos30.length / 30 : 0;

    return {
      totalPraticas,
      tipoMaisRegistrado: tipoMaisRegistrado || null,
      usuarioMaisRegistros: usuarioMaisRegistros || null,
      totalPorTipo,
      mediaDiaria: parseFloat(mediaDiaria.toFixed(2)),
    };
  }
}
