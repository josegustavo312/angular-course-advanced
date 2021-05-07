import { CampoGenerico } from "./campo-generico";

export interface ConfigParams {
    pagina?: number; //? = Opcional
    limite?: number;
    pesquisa?: string;
    campos?: CampoGenerico;
}
