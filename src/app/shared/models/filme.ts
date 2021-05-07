export interface Filme {
    id?: number; //? = Campo Não Obrigatório
    titulo: string;
    urlFoto?: string;
    dtLancamento: Date;
    descricao: string;
    nota: number;
    urlIMDb?: string;
    genero: string;
}
