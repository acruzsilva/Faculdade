import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PraticaDocument = HydratedDocument<Pratica>;

@Schema() 
export class Pratica {
  @Prop({ required: true })
  nomeUsuario: string;

  @Prop()
  nomeUsuarioSearch?: string;

  @Prop({ required: true })
  tipo: string;

  @Prop()
  tipoSearch?: string;

  @Prop({ required: true })
  data: Date;  

  @Prop() 
  descricao?: string;
}

export const PraticaSchema = SchemaFactory.createForClass(Pratica);
