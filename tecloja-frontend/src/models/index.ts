export interface Produto {
  id?: number;
  nome: string;
  descricao?: string;
  preco: number;
  estoque: number;
  categoria_id: number;
  categoria_nome?: string;
}

export interface CartItem {
  produto_id: number;
  nome: string;
  preco: number;
  quantidade: number;
}

export interface ItemPedidoForm {
  produto_id: number;
  quantidade: number;
}

export interface PedidoForm {
  cliente_id: number;
  itens: ItemPedidoForm[];
}

export interface UsuarioLogado {
  token: string;
  username: str;
  papel: string;
}
